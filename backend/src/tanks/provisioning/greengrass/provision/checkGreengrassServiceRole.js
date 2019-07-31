'use strict'

var AWS = require('aws-sdk/global');
var Greengrass = require('aws-sdk/clients/greengrass');

AWS.config.region = process.env.AWS_REGION;
var greengrass = new Greengrass();

module.exports = {
    checkGreengrassServiceRole: async (event, context) => {
        var params = {};

        try {
            var data = await greengrass.getServiceRoleForAccount(params).promise();
            return { exists: true };
        }
        catch (err) {
            if (err.code === 'UnknownError' && err.message === 'You need to attach an IAM role to this AWS account.') {
                return { exists: false }
            } else {
                throw err;
            }
        }
    }
}