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
                DefaultConfig: {
                    Execution: {
                        IsolationMode: GreengrassContainer | NoContainer,
                        RunAs: {
                            Gid: 'NUMBER_VALUE',
                            Uid: 'NUMBER_VALUE'
                        }
                    }
                },
                Functions: [
                    {
                        Id: 'STRING_VALUE', /* required */
                        FunctionArn: 'STRING_VALUE',
                        FunctionConfiguration: {
                            EncodingType: binary | json,
                            Environment: {
                                AccessSysfs: true || false,
                                Execution: {
                                    IsolationMode: GreengrassContainer | NoContainer,
                                    RunAs: {
                                        Gid: 'NUMBER_VALUE',
                                        Uid: 'NUMBER_VALUE'
                                    }
                                },
                                ResourceAccessPolicies: [
                                    {
                                        ResourceId: 'STRING_VALUE', /* required */
                                        Permission: ro | rw
                                    },
                                    /* more items */
                                ],
                                Variables: {
                                    '<__string>': 'STRING_VALUE',
                                    /* '<__string>': ... */
                                }
                            },
                            ExecArgs: 'STRING_VALUE',
                            Executable: 'STRING_VALUE',
                            MemorySize: 'NUMBER_VALUE',
                            Pinned: true || false,
                            Timeout: 'NUMBER_VALUE'
                        }
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
        greengrass.createFunctionDefinition(params, function (err, data) {
            if (err) {
                cb(err, null);
            } else {
                cb(null, data);
            }
        });
    }
}