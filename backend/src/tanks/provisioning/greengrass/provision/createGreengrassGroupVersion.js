'use strict'

var AWS = require('aws-sdk/global');
var Greengrass = require('aws-sdk/clients/greengrass');

AWS.config.region = process.env.AWS_REGION;
var greengrass = new Greengrass();

module.exports = {
    createGroupVersion: function (event, context, cb) {
        var params = {
            GroupId: 'STRING_VALUE', /* required */
            // ConnectorDefinitionVersionArn: 'STRING_VALUE',
            CoreDefinitionVersionArn: 'STRING_VALUE',
            DeviceDefinitionVersionArn: 'STRING_VALUE',
            FunctionDefinitionVersionArn: 'STRING_VALUE',
            LoggerDefinitionVersionArn: 'STRING_VALUE',
            // ResourceDefinitionVersionArn: 'STRING_VALUE',
            SubscriptionDefinitionVersionArn: 'STRING_VALUE'
        };
        greengrass.createGroupVersion(params, function (err, data) {
            if (err) {
                cb(err, null);
            } else {
                cb(null, data);
            }
        });
    }
}