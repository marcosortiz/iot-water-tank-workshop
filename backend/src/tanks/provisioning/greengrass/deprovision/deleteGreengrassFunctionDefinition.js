'use strict'

var AWS = require('aws-sdk/global');
var Greengrass = require('aws-sdk/clients/greengrass');

AWS.config.region = process.env.AWS_REGION;
var greengrass = new Greengrass();

module.exports = {
    deleteGreengrassFunctionDefinition: async (event, context) => {
        
        if (!event.greengrass.FunctionDefinitionId) {
            return null;
        }
        
        var params = {
            FunctionDefinitionId: event.greengrass.FunctionDefinitionId
        };
        var data = await greengrass.deleteFunctionDefinition(params).promise();
        
        return data;
    }
}