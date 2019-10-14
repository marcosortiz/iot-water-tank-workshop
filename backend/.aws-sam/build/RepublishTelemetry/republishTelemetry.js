'use strict'

var AWS      = require('aws-sdk/global');
var Iot      = require('aws-sdk/clients/iot');
var IotData  = require('aws-sdk/clients/iotdata');

AWS.config.region = process.env.AWS_REGION;
var iot = new Iot();
var iotdata = null;


function getIotData(cb) {
    if (iotdata === null) {
        let params = { endpointType: 'iot:Data-ATS' };
        iot.describeEndpoint(params, function(err, data) {
            if (err) cb(err, null)
            else {
                iotdata = new IotData( {endpoint: data.endpointAddress} );
                cb(null, iotdata);
            }
        });
    } else {
        cb(null, iotdata);
    }
}

module.exports =  {
    republishTelemetry: function (event, context, cb) {

        let index = event.telemetry.length -1;
        let  msg = {
            tankId: event.tankId,
            sensorData: event.telemetry[index]                
        }

        getIotData(function(err, client) {
            if (err) console.log(err, err.stack);
            else {
                let params = {
                    topic: `tanks/${event.tankId}/checkThresholds`,
                    payload: Buffer.from(JSON.stringify(msg))
                };
                client.publish(params, function(error, data) {
                    if (err) console.log(error, error.stack);
                    else console.log(`Republishing to ${params.topic}`);
                });
            }
        });
    }
}