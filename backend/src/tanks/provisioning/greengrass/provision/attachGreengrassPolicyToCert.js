'use strict'

var AWS = require('aws-sdk/global');
var Iot = require('aws-sdk/clients/iot');

AWS.config.region = process.env.AWS_REGION;
var iot = new Iot();

module.exports = {

    attachGreengrassPolicyToCert: async (event, context) => {

        var policy = {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Action": [
                        "iot:Connect"
                    ],
                    "Resource": [
                        "*"
                    ]
                },
                {
                    "Effect": "Allow",
                    "Action": [
                        "iot:Publish",
                        "iot:Subscribe",
                        "iot:Receive"
                    ],
                    "Resource": [
                        "arn:aws:iot:region:account-id:topicfilter/$aws/things/core-name-*",
                        "arn:aws:iot:region:account-id:topic/$aws/things/core-name-*",
                        "*"
                    ]
                },
                {
                    "Effect": "Allow",
                    "Action": [
                        "iot:GetThingShadow",
                        "iot:UpdateThingShadow",
                        "iot:DeleteThingShadow"
                    ],
                    "Resource": [
                        "arn:aws:iot:region:account-id:thing/core-name-*",
                        "*"
                    ]
                },
                {
                    "Effect": "Allow",
                    "Action": [
                        "greengrass:AssumeRoleForGroup",
                        "greengrass:CreateCertificate"
                    ],
                    "Resource": [
                        "*"
                    ]
                },
                {
                    "Effect": "Allow",
                    "Action": [
                        "greengrass:GetDeployment"
                    ],
                    "Resource": [
                        "arn:aws:greengrass:region:account-id:/greengrass/groups/group-id/deployments/*"
                    ]
                },
                {
                    "Effect": "Allow",
                    "Action": [
                        "greengrass:GetDeploymentArtifacts"
                    ],
                    "Resource": [
                        "arn:aws:greengrass:region:account-id:/greengrass/groups/group-id/deployments/*"
                    ]
                },
                {
                    "Effect": "Allow",
                    "Action": [
                        "greengrass:UpdateCoreDeploymentStatus"
                    ],
                    "Resource": [
                        "arn:aws:greengrass:region:account-id:/greengrass/groups/group-id/deployments/*/cores/arn%3Aaws%3Aiot%3Aregion%3Aaccount-id%3Athing%2Fcore-name"
                    ]
                },
                {
                    "Effect": "Allow",
                    "Action": [
                        "greengrass:GetConnectivityInfo",
                        "greengrass:UpdateConnectivityInfo"
                    ],
                    "Resource": [
                        "arn:aws:iot:region:account-id:thing/core-name"
                    ]
                }
            ]
        };

        var policyString = JSON.stringify(policy);

        // need to replace region, account-id, group-id, and core-name

        var groupId = event.createGreengrassGroup.Id;
        var accountId = process.env.ACCOUNT_ID;
        var region = process.env.AWS_REGION;
        var coreName = event.thingName;
        var policyName = coreName + '-policy'

        policyString = policyString.replace(/group-id/g, groupId);
        policyString = policyString.replace(/account-id/g, accountId);
        policyString = policyString.replace(/region/g, region);
        policyString = policyString.replace(/core-name/g, coreName);

        var params = {
            policyDocument: policyString, /* required */
            policyName: policyName /* required */
        };

        await iot.createPolicy(params).promise();

        params = { policyName: policyName, target: event.certificateArn };

        return await iot.attachPolicy(params).promise();
    }
}