'use strict'

var AWS = require('aws-sdk/global');
var Greengrass = require('aws-sdk/clients/greengrass');

AWS.config.region = process.env.AWS_REGION;
var greengrass = new Greengrass();

module.exports = {
    createGreengrassLoggerDefinition: function (event, context, cb) {
        var params = {
            InitialVersion: {
                Loggers: [
                    {
                        Component: GreengrassSystem,
                        Id: `${event.thingName}-Logger`,
                        Level: INFO,
                        Type: AWSCloudWatch
                    }
                ]
            },
            Name: `${event.thingName}-Logger-Definition`
        };
        greengrass.createLoggerDefinition(params, function (err, data) {
            if (err) {
                cb(err, null);
            } else {
                cb(null, data);
            }
        });
    }
}