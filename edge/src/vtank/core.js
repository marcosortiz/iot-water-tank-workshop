var AWS      = require('aws-sdk/global');
var DynamoDB = require('aws-sdk/clients/dynamodb');
var S3       = require('aws-sdk/clients/s3');

var Constants = require(`${__dirname}/constants`);
var cache     = require(`${__dirname}/telemetryCache`);

AWS.config.region = Constants.REGION;

const MAX_TANK_LEVEL = 100.00;           // in percentage
const MIN_TANK_LEVEL =   0.00;           // in percentage

function getDelta(initialTankLevel, targetTankLevel, period, tankLevel, status, secs_elapsed=1.0) {
    if(status === Constants.DRAINING_STATUS && tankLevel <= MIN_TANK_LEVEL) {
        return 0;
    } else if (status === Constants.FILLING_STATUS && tankLevel >= targetTankLevel) {
        return 0;
    } else if (status === Constants.FILLING_STATUS || status == Constants.EMPTY_STATUS) {
        var inc = Number(((targetTankLevel - initialTankLevel) / period).toFixed(6));
        return Number((inc * secs_elapsed).toFixed(6));
    } else if (status === Constants.DRAINING_STATUS && tankLevel > targetTankLevel) {
        var dec = Number(((initialTankLevel-targetTankLevel) / period).toFixed(6));
        return Number((-1.0 * dec * secs_elapsed).toFixed(6));
    } else {
        return 0;
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
        const status      = props.status;
        const tankLevel = props.tankLevel
        
        if(status === Constants.DRAINING_STATUS && tankLevel <= MIN_TANK_LEVEL) {
            props.status = Constants.EMPTY_STATUS;
            logger.info(`bot-status-change from ${status} to ${Constants.EMPTY_STATUS}`);
            return;
        } else if(status === Constants.FILLING_STATUS && tankLevel >= MAX_TANK_LEVEL) {
            props.status = Constants.FULL_STATUS;
            logger.info(`bot-status-change from ${status} to ${Constants.FULL_STATUS}`);
            return;
        }

        // Update tankLevel value
        var delta = getDelta(props.initialTankLevel, props.targetTankLevel, props.period, props.tankLevel, status, 1);
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
        cache.recordTelemetry(telemetryData);
        
    },
    getTelemetryData: function() {
        return cache.flushTelemetry();
    }
}
