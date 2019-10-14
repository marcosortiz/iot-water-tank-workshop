'use strict'

var AWS = require('aws-sdk/global');
var Greengrass = require('aws-sdk/clients/greengrass');

AWS.config.region = process.env.AWS_REGION;
var greengrass = new Greengrass();

module.exports = {
    deleteGreengrassSubscriptionDefinition: async (event, context) => {
        
        if (!event.greengrass.SubscriptionDefinitionId) {
            return null;
        }

        var params = {
            SubscriptionDefinitionId: event.greengrass.SubscriptionDefinitionId
        };
        var data = await greengrass.deleteSubscriptionDefinition(params).promise();
    }
}