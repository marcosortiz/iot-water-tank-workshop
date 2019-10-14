'use strict'

var AWS      = require('aws-sdk/global');
var Iot      = require('aws-sdk/clients/iot');

AWS.config.region = process.env.AWS_REGION;
var iot = new Iot();

module.exports =  {
    checkIfThingExists: function (event, context, cb) {
        var params = { thingName: event.thingName };
        iot.describeThing(params, function (err, data) {
            if (err) {
                if( err.code == 'ResourceNotFoundException') {
                    data = {thingName: event.thingName, exists: false, includeGreengrass: event.includeGreengrass}
                    cb(null, data)
                } else {
                    cb(err, null);
                }
            } else if (err === null && data.thingName === event.thingName) {
                data = {thingName: event.thingName, exists: true, includeGreengrass: event.includeGreengrass}
                cb(null, data)
            }
        });
    }
}