'use strict'

var AWS = require('aws-sdk/global');
var Greengrass = require('aws-sdk/clients/greengrass');

AWS.config.region = process.env.AWS_REGION;
var greengrass = new Greengrass();

module.exports = {
    createGreengrassCoreDefinition: async (event, context) => {
        var params = {
            InitialVersion: {
                Cores: [
                    {
                        CertificateArn: event.certificateArn,
                        Id: `${event.thingName}-Core`,
                        SyncShadow: true,
                        ThingArn: event.thingArn
                    }
                ]
            },
            Name: `${event.thingName}-Core-Definition`
        };
        var data = await greengrass.createCoreDefinition(params).promise();
        
        return data;
    }
}