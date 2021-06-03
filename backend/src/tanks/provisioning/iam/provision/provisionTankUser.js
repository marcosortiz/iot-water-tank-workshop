'use strict'
const Greengrass = require("greengrass-policy");
const Lambda = require("lambda-policy");

var AWS = require('aws-sdk/global');
var IAM = require('aws-sdk/clients/iam');

AWS.config.region = process.env.AWS_REGION;
var iam = new IAM();

module.exports = {
    provisionTankUser: async (event, context) => {

        var THING_NAME = event.thingName;
        var FUNCTION_NAME = event.provisionGreengrass[2].createLambdaFunction.FunctionName
        var GROUP_ID = event.provisionGreengrass[0].createGreengrassGroup.Id;

        var params = {
            UserName: THING_NAME
        };
        var response = await iam.createUser(params).promise();

        // create and attach Greengrass policy

        var policyString = JSON.stringify(Greengrass.GREENGRASS_POLICY);

        policyString = policyString.replace(/FUNCTION-DEFINITION/g, event.provisionGreengrass[2].createFunctionDefinition.Id);
        policyString = policyString.replace(/SUBSCRIPTION-DEFINITION/g, event.createSubscriptionDefinition.Id);
        policyString = policyString.replace(/CORE-DEFINITION/g, event.provisionGreengrass[1].Id);
        policyString = policyString.replace(/DEVICE-DEFINITION/g, event.provisionGreengrass[3].Id);
        policyString = policyString.replace(/LOGGER-DEFINITION/g, event.provisionGreengrass[4].Id);
        policyString = policyString.replace(/THING-NAME/g, THING_NAME);
        policyString = policyString.replace(/GROUP-ID/g, GROUP_ID);

        params = {
            PolicyDocument: policyString,
            PolicyName: `${THING_NAME}-Greengrass-Policy`
        };

        response = await iam.createPolicy(params).promise();

        params = {
            PolicyArn: response.Policy.Arn, 
            UserName: THING_NAME
        };

        response = await iam.attachUserPolicy(params).promise();

        // create and attach Lambda policy

        policyString = JSON.stringify(Lambda.LAMBDA_POLICY);

        policyString = policyString.replace(/FUNCTION-NAME/g, FUNCTION_NAME);

        params = {
            PolicyDocument: policyString,
            PolicyName: `${THING_NAME}-Lambda-Policy`
        };

        response = await iam.createPolicy(params).promise();

        params = {
            PolicyArn: response.Policy.Arn, 
            UserName: THING_NAME
        };

        response = await iam.attachUserPolicy(params).promise();
    }
}