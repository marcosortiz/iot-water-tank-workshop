'use strict'

var AWS = require('aws-sdk/global');
var Greengrass = require('aws-sdk/clients/greengrass');

AWS.config.region = process.env.AWS_REGION;
var greengrass = new Greengrass();

module.exports = {
    createGreengrassLoggerDefinition: async (event, context) => {
        var params = {
            InitialVersion: {
                Loggers: [
                    {
                        Component: 'GreengrassSystem',
                        Id: `${event.thingName}-Logger`,
                        Level: 'INFO',
                        Type: 'AWSCloudWatch'
                    }
                ]
            },
            Name: `${event.thingName}-Logger-Definition`
        };
        var data = await greengrass.createLoggerDefinition(params).promise();

        return data;
    }
}