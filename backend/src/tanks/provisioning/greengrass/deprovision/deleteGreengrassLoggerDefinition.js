'use strict'

var AWS = require('aws-sdk/global');
var Greengrass = require('aws-sdk/clients/greengrass');

AWS.config.region = process.env.AWS_REGION;
var greengrass = new Greengrass();

module.exports = {
    deleteGreengrassLoggerDefinition: async (event, context) => {
        
        if (!event.greengrass.LoggerDefinitionId) {
            return null;
        }

        var params = {
            LoggerDefinitionId: event.greengrass.LoggerDefinitionId
        };
        var data = await greengrass.deleteLoggerDefinition(params).promise();

        return data;
    }
}