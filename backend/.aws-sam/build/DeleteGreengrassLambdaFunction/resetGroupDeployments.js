'use strict'

var AWS = require('aws-sdk/global');
var Greengrass = require('aws-sdk/clients/greengrass');

AWS.config.region = process.env.AWS_REGION;
var greengrass = new Greengrass();

module.exports = {
    resetGroupDeployments: async (event, context) => {

        var params = {
            GroupId: event.greengrass.GroupId,
            Force: true || false
        };

        var data = await greengrass.resetDeployments(params).promise();

        return data;
    }
}