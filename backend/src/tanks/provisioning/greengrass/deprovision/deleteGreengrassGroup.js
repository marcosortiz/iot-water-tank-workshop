'use strict'

var AWS = require('aws-sdk/global');
var Greengrass = require('aws-sdk/clients/greengrass');

AWS.config.region = process.env.AWS_REGION;
var greengrass = new Greengrass();

module.exports = {
    deleteGreengrassGroup: function (event, context, cb) {
        var params = {
            GroupId: 'STRING_VALUE' /* required */
        };
        greengrass.deleteGroup(params, function (err, data) {
            if (err) {
                cb(err, null);
            } else {
                cb(null, data);
            }
        });
    }
}