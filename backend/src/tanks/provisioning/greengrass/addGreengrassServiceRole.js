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
var ROLE_NAME = 'Greengrass-Service-Role';
var POLICY_ARN = 'arn:aws:iam::aws:policy/service-role/AWSGreengrassResourceAccessRolePolicy';
var ASSUME_ROLE_POLICY_DOC = '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"greengrass.amazonaws.com"},"Action":"sts:AssumeRole"}]}';
var ROLE_DESCRIPTION = 'Greengrass Service Role';

module.exports = {
    addGreengrassServiceRole: function (event, context, cb) {

        var params = {
            AssumeRolePolicyDocument: ASSUME_ROLE_POLICY_DOC,
            RoleName: ROLE_NAME,
            Description: ROLE_DESCRIPTION
        };
        iam.createRole(params, function (err, data) {
            if (err) {
                cb(err, null);
            } else {
                responseData.serviceRoleArn = data.Role.Arn;

                var params = {
                    PolicyArn: POLICY_ARN,
                    RoleName: ROLE_NAME
                };
                iam.attachRolePolicy(params, function (err, data) {
                    if (err) {
                        cb(err, null);
                    } else {
                        var params = {
                            RoleArn: responseData.serviceRoleArn
                        };
                        greengrass.associateServiceRoleToAccount(params, function (err, data) {
                            if (err) {
                                cb(err, null);
                            } else {
                                cb(null, responseData)
                            }
                        });
                    }
                });

            }
        });
    }
}