'use strict'

var AWS = require('aws-sdk/global');
var Greengrass = require('aws-sdk/clients/greengrass');

AWS.config.region = process.env.AWS_REGION;
var greengrass = new Greengrass();

module.exports = {
    createGreengrassGroup: async (event, context) => {
        var params = {
            Name: `${event.thingName}-Group`,
        };
        var data = await greengrass.createGroup(params).promise();
        
        return data;
    }
}