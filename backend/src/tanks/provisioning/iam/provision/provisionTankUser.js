'use strict'

import GREENGRASS_POLICY from 'greengrass-policy';
import LAMBDA_POLICY from 'lambda-policy';

var AWS = require('aws-sdk/global');
var IAM = require('aws-sdk/clients/iam');

AWS.config.region = process.env.AWS_REGION;
var iam = new IAM();

module.exports = {
    provisionTankUser: async (event, context) => {

        THING_NAME = event.thingName;
        FUNCTION_NAME = event.provisionGreengrass[2].createLambdaFunction.FunctionName
        GROUP_ID = event.provisionGreengrass[0].createGreengrassGroup.Id;

        var params = {
            UserName: THING_NAME
        };
        var response = await iam.createUser(params).promise();

        // create and attach Greengrass policy

        var policyString = JSON.stringify(GREENGRASS_POLICY);

        policyString = policyString.replace(/THING/g, THING_NAME);
        policyString = policyString.replace(/GROUP/g, GROUP_ID);

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

        policyString = JSON.stringify(LAMBDA_POLICY);

        policyString = policyString.replace(/FUNCTION_NAME/g, FUNCTION_NAME);

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