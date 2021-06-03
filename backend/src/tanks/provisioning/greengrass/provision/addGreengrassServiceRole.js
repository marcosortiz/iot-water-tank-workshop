'use strict'

var AWS = require('aws-sdk/global');
var IAM = require('aws-sdk/clients/iam');
var Greengrass = require('aws-sdk/clients/greengrass');

AWS.config.region = process.env.AWS_REGION;
var greengrass = new Greengrass();
var iam = new IAM();

var responseData = {
    serviceRoleArn: null
};
const ROLE_NAME = 'Greengrass-Service-Role';
const POLICY_ARN = 'arn:aws:iam::aws:policy/service-role/AWSGreengrassResourceAccessRolePolicy';
const ASSUME_ROLE_POLICY_DOC = '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"greengrass.amazonaws.com"},"Action":"sts:AssumeRole"}]}';
const ROLE_DESCRIPTION = 'Greengrass Service Role';

module.exports = {
    addGreengrassServiceRole: async (event, context) => {

        var params = {
            AssumeRolePolicyDocument: ASSUME_ROLE_POLICY_DOC,
            RoleName: ROLE_NAME,
            Description: ROLE_DESCRIPTION
        };

        var data = await iam.createRole(params).promise();

        responseData.serviceRoleArn = data.Role.Arn;

        params = {
            PolicyArn: POLICY_ARN,
            RoleName: ROLE_NAME
        };

        data = await iam.attachRolePolicy(params).promise();

        var params = {
            RoleArn: responseData.serviceRoleArn
        };

        data = await greengrass.associateServiceRoleToAccount(params).promise();

        return responseData;
    }
}