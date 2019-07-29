'use strict'

var AWS = require('aws-sdk/global');
var Greengrass = require('aws-sdk/clients/greengrass');

AWS.config.region = process.env.AWS_REGION;
var greengrass = new Greengrass();

var CERTIFICATE_ARN = 'arn:aws:iot:us-east-1:486026799233:cert/9b3d58f8580b033d1f590adfad55a45887feaf38390a0f059b1ea3e775c533fe';
var THING_ARN = 'arn:aws:iot:us-east-1:486026799233:thing/test-thing';

module.exports = {
    createGreengrassDeviceDefinition: function (event, context, cb) {
        var params = {
            AmznClientToken: 'STRING_VALUE',
            InitialVersion: {
                Devices: [
                    {
                        CertificateArn: CERTIFICATE_ARN,
                        Id: 'STRING_VALUE',
                        SyncShadow: true || false,
                        ThingArn: THING_ARN
                    },
                    /* more items */
                ]
            },
            Name: 'STRING_VALUE',
            tags: {
                '<__string>': 'STRING_VALUE',
                /* '<__string>': ... */
            }
        };
        greengrass.createDeviceDefinition(params, function (err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else console.log(data);           // successful response
        });
    }
}