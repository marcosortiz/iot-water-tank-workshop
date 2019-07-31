'use strict'

var AWS = require('aws-sdk/global');
var Greengrass = require('aws-sdk/clients/greengrass');

AWS.config.region = process.env.AWS_REGION;
var greengrass = new Greengrass();

module.exports = {
    createGreengrassDeviceDefinition: async (event, context) => {
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
        var data = await greengrass.createDeviceDefinition(params).promise();
        
        return data;
    }
}