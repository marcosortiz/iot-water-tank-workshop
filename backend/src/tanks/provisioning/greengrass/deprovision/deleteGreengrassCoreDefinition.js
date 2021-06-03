'use strict'

var AWS = require('aws-sdk/global');
var Greengrass = require('aws-sdk/clients/greengrass');

AWS.config.region = process.env.AWS_REGION;
var greengrass = new Greengrass();

module.exports = {
    deleteGreengrassCoreDefinition: async (event, context) => {
        
        if (!event.greengrass.CoreDefinitionId) {
            return null;
        }

        var params = {
            CoreDefinitionId: event.greengrass.CoreDefinitionId
        };
        var data = await greengrass.deleteCoreDefinition(params).promise();

        return data;
    }
}