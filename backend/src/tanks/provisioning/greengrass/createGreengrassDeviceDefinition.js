'use strict'

var AWS = require('aws-sdk/global');
var Greengrass = require('aws-sdk/clients/greengrass');

AWS.config.region = process.env.AWS_REGION;
var greengrass = new Greengrass();

module.exports = {
    createGreengrassDeviceDefinition: function (event, context, cb) {
        var params = {
            InitialVersion: {
                Devices: [
                    {
                        CertificateArn: event.certificateArn,
                        Id: `${event.thingName}-Device`,
                        SyncShadow: true,
                        ThingArn: event.thingArn
                    }
                ]
            },
            Name: `${event.thingName}-Device-Definition`
        };
        greengrass.createDeviceDefinition(params, function (err, data) {
            if (err) {
                cb(err, null);
            } else {
                cb(null, data);
            }
        });
    }
}