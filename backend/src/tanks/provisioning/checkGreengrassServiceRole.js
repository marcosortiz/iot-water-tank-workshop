'use strict'

var AWS = require('aws-sdk/global');
var Greengrass = require('aws-sdk/clients/greengrass');

AWS.config.region = process.env.AWS_REGION;
var greengrass = new Greengrass();

module.exports =  {
    checkGreengrassServiceRole: function (event, context, cb) {
        var params = {};
        greengrass.getServiceRoleForAccount(params, function(err, data) {
            if (err) {
                if( err.code === 'UnknownError' && err.message === 'You need to attach an IAM role to this AWS account.') {
                    data = {exists: false}
                    cb(null, data)
                } else {
                    cb(err, null);
                }
            } else if (err === null) {
                data = {exists: true}
                cb(null, data)
            }
        });
    }
}