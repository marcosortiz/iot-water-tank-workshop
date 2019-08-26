'use strict'

var AWS = require('aws-sdk/global');
var Greengrass = require('aws-sdk/clients/greengrass');

AWS.config.region = process.env.AWS_REGION;
var greengrass = new Greengrass();

module.exports = {
    createGreengrassGroupVersion: async (event, context) => {
        var params = {
            GroupId: event.provisionGreengrass[0].createGreengrassGroup.Id,
            CoreDefinitionVersionArn: event.provisionGreengrass[1].LatestVersionArn,
            FunctionDefinitionVersionArn: event.provisionGreengrass[2].createFunctionDefinition.LatestVersionArn,
            DeviceDefinitionVersionArn: event.provisionGreengrass[3].LatestVersionArn,
            LoggerDefinitionVersionArn: event.provisionGreengrass[4].LatestVersionArn,
            SubscriptionDefinitionVersionArn: event.createSubscriptionDefinition.LatestVersionArn
            // ConnectorDefinitionVersionArn: 'STRING_VALUE',
            // ResourceDefinitionVersionArn: 'STRING_VALUE',
        };

        var data = await greengrass.createGroupVersion(params).promise();

        return data;
    }
}