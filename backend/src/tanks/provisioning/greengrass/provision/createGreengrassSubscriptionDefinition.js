'use strict'

var AWS = require('aws-sdk/global');
var Greengrass = require('aws-sdk/clients/greengrass');

AWS.config.region = process.env.AWS_REGION;
var greengrass = new Greengrass();

module.exports = {
    createGreengrassSubscriptionDefinition: async (event, context) => {
        var params = {
            InitialVersion: {
                Subscriptions: [
                    {
                        Id: `${event.thingName}-Subscription`,
                        Source: `${eprocess.env.FUNCTION_ARN}:1`, /* required */
                        Subject: '#', /* required */
                        Target: 'cloud'
                    }
                ]
            },
            Name: `${event.thingName}-Subscription-Definition`,
        };
        var data = await greengrass.createSubscriptionDefinition(params).promise();

        return data;
    }
}