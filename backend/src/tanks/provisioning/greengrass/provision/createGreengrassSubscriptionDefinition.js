'use strict'

var AWS = require('aws-sdk/global');
var Greengrass = require('aws-sdk/clients/greengrass');

AWS.config.region = process.env.AWS_REGION;
var greengrass = new Greengrass();

module.exports = {
    createGreengrassResourceDefinition: function (event, context, cb) {
        var params = {
            AmznClientToken: 'STRING_VALUE',
            InitialVersion: {
                Subscriptions: [
                    {
                        Id: 'STRING_VALUE', /* required */
                        Source: 'STRING_VALUE', /* required */
                        Subject: 'STRING_VALUE', /* required */
                        Target: 'STRING_VALUE' /* required */
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
        greengrass.createSubscriptionDefinition(params, function (err, data) {
            if (err) {
                cb(err, null);
            } else {
                cb(null, data);
            }
        });
    }
}