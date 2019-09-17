'use strict'

var AWS      = require('aws-sdk/global');
var Iot      = require('aws-sdk/clients/iot');
var IoTData  = require('aws-sdk/clients/iotdata');

AWS.config.region = process.env.AWS_REGION;
var iotData = null;
var iot     = new Iot();

function getIotEndpoint(cb) {
    if (iotData === null) {
        console.log('Fetching iot endpoint ...')
        iot.describeEndpoint({}, function(err, data) {
            if (err) console.log(err, err.stack);
            console.log('data:', data)
            var iotEndpoint = data.endpointAddress;
            iotData = new IoTData({endpoint: iotEndpoint});
            console.log(`iot endpoint set to ${iotEndpoint}`);
            cb(err, data);
        });
    } else {
        cb(null, {});
    }
}

module.exports =  {
    publish: function (event, context, cb) {
        let tankId = event.payload.detector.keyValue;
        getIotEndpoint( function(e, d) {
            var params = {
                topic: `tanks/${tankId}/tankLevelEvent`,
                payload: JSON.stringify(event)
            }
            console.log('params:', params);

            iotData.publish(params, function (err, data) {
                if (err) console.log(err, err.stack);
                else console.log(data);
            });
        });
    }
}