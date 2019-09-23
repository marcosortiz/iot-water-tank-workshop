'use strict'

var AWS = require('aws-sdk/global');
var Lambda = require('aws-sdk/clients/lambda');
var Lambda = require('aws-sdk/clients/iam');

AWS.config.region = process.env.AWS_REGION;
var lambda = new Lambda();
var iam = new IAM();

module.exports = {
    deleteGreengrassLambdaFunction: async (event, context) => {
        var params = {
            FunctionName: `${event.checkForGreengrass.thingName}-GreengrassLambdaFunction`
          };
        var data = await lambda.deleteFunction(params).promise();

        params = params = {
            RoleName: `${event.checkForGreengrass.thingName}-GreengrassLambdaRole`
           };
        data = await iam.deleteRole(params).promise();
        return data;
    }
}