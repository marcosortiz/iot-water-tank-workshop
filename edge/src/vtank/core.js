var AWS      = require('aws-sdk/global');
var DynamoDB = require('aws-sdk/clients/dynamodb');
var S3       = require('aws-sdk/clients/s3');

var Constants = require(`${__dirname}/constants`);
var cache     = require(`${__dirname}/telemetryCache`);

AWS.config.region = Constants.REGION;

const OLD_VERSION = '1.0'
const OLD_VERSION_TANK_LEVEL  = (30);  //  60 secs
const NEW_VERSION_TANK_LEVEL  = (60);  // 120 secs
const OLD_VERSION_FILLING_TIME = 60;    //  60 secs
const NEW_VERSION_FILLING_TIME = 30;    //  30 secs

const STANDBY_TANK_LEVEL_MULTIPLIER = 0.5;

const MAX_TANK_LEVEL = 100.00;           // in percentage
const MIN_TANK_LEVEL =   0.00;           // in percentage

const DEFAULT_FILLING_THRESHOLD = 15.00;  // in percentage

function getDelta(version, status, secs_elapsed=1.0) {
    if (status === Constants.OFF_STATUS) {
        return 0.0;
    } 
    else if (status === Constants.FILLING_STATUS || status == Constants.STANDBY_STATUS) {
        var inc = Number((MAX_TANK_LEVEL / OLD_VERSION_FILLING_TIME).toFixed(6));
        if (version !== OLD_VERSION) {
            inc = Number((MAX_TANK_LEVEL / NEW_VERSION_FILLING_TIME).toFixed(6));
        }
        return Number((inc * secs_elapsed).toFixed(6));
    } else if (status === Constants.DRAINING_STATUS) {
        var dec = Number((MAX_TANK_LEVEL / OLD_VERSION_TANK_LEVEL).toFixed(6));
        if (version !== OLD_VERSION) {
            dec = Number((MAX_TANK_LEVEL / NEW_VERSION_TANK_LEVEL).toFixed(6));
        }
        return Number((-1.0 * dec * secs_elapsed).toFixed(6));
    }
}


function getThing(thingName, cb) {
    const ddb = new DynamoDB();
    var params = {
        TableName: Constants.IOT_THINGS_TABLE,
        Key: {
            "thingName": {
                S: thingName
            }
        },
    }
    ddb.getItem(params, function(err, data) {
        if(cb) cb(err, data);
    });
}

function getKeysAndCert(certificateId, cb) {
    const s3  = new S3();

    var params = {
        Bucket: Constants.S3_BUCKET,
        Key: certificateId
    }
    s3.getObject(params, function(err, data) {
        if(cb) cb(err, data);
    });
}

module.exports = {
    bootstrap: function(thingName, cb) {
        getThing(thingName, function(err, ddb_data) {
            if (err) cb(err, null);
            else {
                if(ddb_data.Item) {
                    const certificateId = ddb_data.Item.certificateId.S;
                    getKeysAndCert(certificateId, function(err, s3_data) {
                        if(err) cb(err, null);
                        else {
                            const certs = JSON.parse(s3_data.Body);
                            cb(null, certs);
                        }
                    });
                } else {
                    err = new Error(`Thing with thingName='${thingName}' does not exist.`);
                    cb(err, null);
                }
            }
        });
    },
    updateState: function (props, logger) {
        const version     = props.version;
        const status      = props.status;
        const tankLevel = props.tankLevel
        
        // Check if there is a status change needed
        if(status === Constants.OFF_STATUS) return ;
        if(props.startDrainRequested) {
            logger.info(`bot-status-change from ${status} to ${Constants.DRAINING_STATUS}`);
            props.status = Constants.DRAINING_STATUS;
            props.startDrainRequested = false;
        }
        if(props.standByRequested) {
            logger.info(`bot-status-change from ${status} to ${Constants.STANDBY_STATUS}`);
            props.status = Constants.STANDBY_STATUS;
            props.standByRequested = false;
        }
        // else if (status === Constants.DRAINING_STATUS && tankLevel <= DEFAULT_FILLING_THRESHOLD && props.autoCirculateEnabled === true) {
        //     props.status = Constants.FILLING_STATUS;
        //     logger.info(`bot-status-change from ${status} to ${Constants.FILLING_STATUS}`);
        //     return;
        else if(status === Constants.DRAINING_STATUS && tankLevel <= MIN_TANK_LEVEL) {
            props.status = Constants.FILLING_STATUS;
            logger.info(`bot-status-change from ${status} to ${Constants.FILLING_STATUS}`);
            return;
        } else if(status === Constants.FILLING_STATUS && tankLevel >= MAX_TANK_LEVEL) {
            props.status = Constants.DRAINING_STATUS;
            logger.info(`bot-status-change from ${status} to ${Constants.DRAINING_STATUS}`);
            return;
        }

        // Update tankLevel value
        var delta = getDelta(version, status, 1);
        var newValue = props.tankLevel + delta;
        if (newValue > MAX_TANK_LEVEL) {
            newValue = MAX_TANK_LEVEL;
        } else if (newValue < MIN_TANK_LEVEL) {
            newValue = MIN_TANK_LEVEL;
        }
        props.tankLevel = Number(newValue.toFixed(6));
        telemetryData = {
            recorded_at: Date.now(),
            tankLevel: tankLevel
        }
        if (version === OLD_VERSION) { // just send 1 sec of data
            cache.recordTelemetry(telemetryData, 1);
        } else { // send up to 2 mins of data
            cache.recordTelemetry(telemetryData);
        }
        
    },
    getTelemetryData: function() {
        return cache.flushTelemetry();
    }
}
