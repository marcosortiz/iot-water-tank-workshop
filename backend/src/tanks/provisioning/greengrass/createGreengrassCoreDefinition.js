'use strict'

var AWS = require('aws-sdk/global');
var Greengrass = require('aws-sdk/clients/greengrass');

AWS.config.region = process.env.AWS_REGION;
var greengrass = new Greengrass();

module.exports = {
    createGreengrassCoreDefinition: function (event, context, cb) {
        var params = {
            InitialVersion: {
                Cores: [
                    {
                        CertificateArn: 'STRING_VALUE',
                        Id: 'STRING_VALUE',
                        SyncShadow: true || false,
                        ThingArn: 'STRING_VALUE'
                    }
                ]
            },
            Name: 'STRING_VALUE'
        };
        greengrass.createCoreDefinition(params, function (err, data) {
            if (err) {
                cb(err, null);
            } else {
                cb(null, data);
            }
        });
    }
}