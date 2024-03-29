'use strict'

var AWS            = require('aws-sdk/global');
var IoTEventsData  = require('aws-sdk/clients/ioteventsdata');

AWS.config.region = process.env.AWS_REGION;
var ioteventsdata = new IoTEventsData();

module.exports =  {
    batchPutMessage: function (event, context, cb) {
        console.log('event:', event);
        let workshopModeOn = process.env.WORKSHOP_MODE === 'ON';
        let inputName = workshopModeOn ? event.tankId : 'tankLevel';

        var params = {
            messages: [
                {
                    inputName: inputName,
                    messageId: `${new Date().getTime()}`,
                    payload: Buffer.from(JSON.stringify(event))
                }
            ]
        }
        ioteventsdata.batchPutMessage(params, function (err, data) {
            if (err) console.log(err, err.stack);
            else console.log(data);
        });
    }
}