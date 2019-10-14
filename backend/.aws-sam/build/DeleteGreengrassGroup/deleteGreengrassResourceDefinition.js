'use strict'

var AWS = require('aws-sdk/global');
var Greengrass = require('aws-sdk/clients/greengrass');

AWS.config.region = process.env.AWS_REGION;
var greengrass = new Greengrass();

module.exports = {
    deleteGreengrassResourceDefinition: async (event, context) => {
        
        if (!event.greengrass.ResourceDefinitionId) {
            return null;
        }

        var params = {
            ResourceDefinitionId: event.greengrass.ResourceDefinitionId
        };
        var data = await greengrass.deleteResourceDefinition(params).promise();

        return data;
    }
}