'use strict'

var AWS      = require('aws-sdk/global');
var Iot      = require('aws-sdk/clients/iot');

AWS.config.region = process.env.AWS_REGION;
var iot = new Iot();

module.exports =  {
    attachPolicyToCert: function(event, context, cb) {
        var params = { policyName: process.env.POLICY_NAME, target: event.certificateArn };

        iot.attachPolicy(params, function (err, data) {
            if (err) {
                cb(err, null);
            } else {
                cb(null, 'Successfully attached policy to certificate.');
            }
        });
    }
}