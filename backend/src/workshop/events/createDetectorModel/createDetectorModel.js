'use strict'

var AWS            = require('aws-sdk/global');
var IoTEvents  = require('aws-sdk/clients/iotevents');

AWS.config.region = process.env.AWS_REGION;
var iotevents = new IoTEvents();

module.exports =  {
    createDetectorModel: function (event, context, cb) {
        let params = {
            detectorModelName: process.env.DETECTOR_MODEL_NAME
        }
        iotevents.describeDetectorModel(params, function (err, data) {
            if (err) console.log(err, err.stack);
            else {
                let initialStateName = data.detectorModel.detectorModelDefinition.initialStateName;
                let states = data.detectorModel.detectorModelDefinition.states;

                let params = {
                    detectorModelDefinition: {
                        initialStateName: initialStateName,
                        states: states
    
                    },
                    detectorModelName: event.tankId,
                    roleArn: process.env.ROLE_ARN,
                };

                console.log('params:', params);
                iotevents.createDetectorModel(params, function (err, data) {
                    if (err) console.log(err, err.stack);
                    else return data;
                });
            }
        });
    }
}