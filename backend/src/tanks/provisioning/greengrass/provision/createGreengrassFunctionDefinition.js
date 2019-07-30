'use strict'

var AWS = require('aws-sdk/global');
var Greengrass = require('aws-sdk/clients/greengrass');

AWS.config.region = process.env.AWS_REGION;
var greengrass = new Greengrass();

module.exports = {
    createGreengrassFunctionDefinition: function (event, context, cb) {

        var params = {
            InitialVersion: {
                Functions: [
                    {
                        Id: `${event.thingName}-Function`,
                        FunctionArn: event,
                        FunctionConfiguration: {
                            Executable: 'greengrassHelloWorld.function_handler',
                            MemorySize: 128,
                            Timeout: 15
                        }
                    }
                ]
            },
            Name: `${event.thingName}-Function-Definition`,
        };
        greengrass.createFunctionDefinition(params, function (err, data) {
            if (err) {
                cb(err, null);
            } else {
                cb(null, data);
            }
        });
    }
}