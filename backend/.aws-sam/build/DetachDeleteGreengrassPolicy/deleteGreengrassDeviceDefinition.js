'use strict'

var AWS = require('aws-sdk/global');
var Greengrass = require('aws-sdk/clients/greengrass');

AWS.config.region = process.env.AWS_REGION;
var greengrass = new Greengrass();

module.exports = {
    deleteGreengrassDeviceDefinition: async (event, context) => {
        
        if (!event.greengrass.DeviceDefinitionId) {
            return null;
        }

        var params = {
            DeviceDefinitionId: event.greengrass.DeviceDefinitionId
        };
        var data = await greengrass.deleteDeviceDefinition(params).promise();

        return data;
    }
}