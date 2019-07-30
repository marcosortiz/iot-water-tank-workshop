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
                Resources: [
                    {
                        Id: 'STRING_VALUE', /* required */
                        Name: 'STRING_VALUE', /* required */
                        ResourceDataContainer: { /* required */
                            LocalDeviceResourceData: {
                                GroupOwnerSetting: {
                                    AutoAddGroupOwner: true || false,
                                    GroupOwner: 'STRING_VALUE'
                                },
                                SourcePath: 'STRING_VALUE'
                            },
                            LocalVolumeResourceData: {
                                DestinationPath: 'STRING_VALUE',
                                GroupOwnerSetting: {
                                    AutoAddGroupOwner: true || false,
                                    GroupOwner: 'STRING_VALUE'
                                },
                                SourcePath: 'STRING_VALUE'
                            },
                            S3MachineLearningModelResourceData: {
                                DestinationPath: 'STRING_VALUE',
                                S3Uri: 'STRING_VALUE'
                            },
                            SageMakerMachineLearningModelResourceData: {
                                DestinationPath: 'STRING_VALUE',
                                SageMakerJobArn: 'STRING_VALUE'
                            },
                            SecretsManagerSecretResourceData: {
                                ARN: 'STRING_VALUE',
                                AdditionalStagingLabelsToDownload: [
                                    'STRING_VALUE',
                                    /* more items */
                                ]
                            }
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
        greengrass.createResourceDefinition(params, function (err, data) {
            if (err) {
                cb(err, null);
            } else {
                cb(null, data);
            }
        });
    }
}