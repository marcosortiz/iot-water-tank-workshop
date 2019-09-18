'use strict'

var AWS      = require('aws-sdk/global');
var Iot      = require('aws-sdk/clients/iot');

AWS.config.region = process.env.AWS_REGION;
var iot = new Iot();

module.exports =  {
    detachPolicyFromCert: function (event, context, cb) {
        var params = { policyName: process.env.POLICY_NAME, target: event.certificateArn };
        iot.detachPolicy(params, function (err, data) {
            cb(err, event);
        });
    }
}