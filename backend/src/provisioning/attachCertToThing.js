'use strict'

var AWS      = require('aws-sdk/global');
var Iot      = require('aws-sdk/clients/iot');

AWS.config.region = process.env.AWS_REGION;
var iot = new Iot();


module.exports =  {
    attachCertToThing: function (event, context, cb) {
        var params = { principal: event.certificateArn, thingName: event.thingName };
        iot.attachThingPrincipal(params, function (err, data) {
            if (err) {
                cb(err, data);
            } else {
                cb(null, event);
            }
        });
    }
}