'use strict'

var AWS = require('aws-sdk/global');
var Greengrass = require('aws-sdk/clients/greengrass');

AWS.config.region = process.env.AWS_REGION;
var greengrass = new Greengrass();

module.exports = {
    deleteGreengrassGroup: async (event, context) => {
        var params = {
            GroupId: event.greengrass.GroupId
        };
        var data = await greengrass.deleteGroup(params).promise();

        return data;
    }
}