'use strict'

var AWS = require('aws-sdk/global');
var IAM = require('aws-sdk/clients/iam');
var Lambda = require('aws-sdk/clients/lambda');

AWS.config.region = process.env.AWS_REGION;
var lambda = new Lambda();
var iam = new IAM();
var responseData = {};
const S3_BUCKET = 'jonslo-aws-samples-us-east-1';
const S3_KEY = 'aws-greengrass-core-sdk-python/greengrassHelloWorld.zip';
const ROLE_NAME_SUFFIX = 'GreengrassLambdaRole';
const POLICY_ARNS = [
    'arn:aws:iam::aws:policy/service-role/AWSGreengrassResourceAccessRolePolicy',
    'arn:aws:iam::aws:policy/AWSGreengrassFullAccess',
    'arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole'
];
const ASSUME_ROLE_POLICY_DOC = '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"lambda.amazonaws.com"},"Action":"sts:AssumeRole"}]}';
const ROLE_DESCRIPTION_SUFFIX = 'Greengrass Lambda Role';

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
    createGreengrassLambdaFunction: async (event, context) => {

        var roleName = `${event.thingName}-${ROLE_NAME_SUFFIX}`;

        var params = {
            AssumeRolePolicyDocument: ASSUME_ROLE_POLICY_DOC,
            RoleName: roleName,
            Description: `${event.thingName} ${ROLE_DESCRIPTION_SUFFIX}`
        };

        var data = await iam.createRole(params).promise();
        responseData.lambdaRoleArn = data.Role.Arn;

        data = await iam.attachRolePolicy({ PolicyArn: POLICY_ARNS[0], RoleName: roleName }).promise();

        data = await iam.attachRolePolicy({ PolicyArn: POLICY_ARNS[1], RoleName: roleName }).promise();

        data = await iam.attachRolePolicy({ PolicyArn: POLICY_ARNS[2], RoleName: roleName }).promise();

        var params = {
            Code: {
                "S3Bucket": S3_BUCKET,
                "S3Key": S3_KEY
            },
            Description: `Greengrass Lambda Function for ${event.thingName}`,
            FunctionName: `${event.thingName}-GreengrassLambdaFunction`,
            Handler: "greengrassHelloWorld.function_handler",
            MemorySize: 128,
            Publish: true,
            Role: responseData.lambdaRoleArn,
            Runtime: "python3.7",
            Timeout: 15
        };

        // await sleep(8000);

        data = await lambda.createFunction(params).promise();
        return data;
    }
}