'use strict'

var AWS = require('aws-sdk/global');
var Lambda = require('aws-sdk/clients/lambda');
var IAM = require('aws-sdk/clients/iam');

AWS.config.region = process.env.AWS_REGION;
var lambda = new Lambda();
var iam = new IAM();

module.exports = {
    deleteGreengrassLambdaFunction: async (event, context) => {

        const ROLE_NAME = `${event.checkForGreengrass.thingName}-GreengrassLambdaRole`

        var params = {
            FunctionName: `${event.checkForGreengrass.thingName}-GreengrassLambdaFunction`
        };
        var data = await lambda.deleteFunction(params).promise();

        params = {
            RoleName: ROLE_NAME
        };
        data = await iam.listAttachedRolePolicies(params).promise()

        var i;
        for (i = 0; i < data.AttachedPolicies.length; i++) {
            var params2 = {
                PolicyArn: data.AttachedPolicies[i].PolicyArn,
                RoleName: ROLE_NAME
            };
            await await iam.detachRolePolicy(params2).promise();
        }
        
        params = params = {
            RoleName: ROLE_NAME
        };
        data = await iam.deleteRole(params).promise();
        return data;
    }
}