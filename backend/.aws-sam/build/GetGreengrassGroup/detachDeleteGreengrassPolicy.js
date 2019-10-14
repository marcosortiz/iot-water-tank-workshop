'use strict'

var AWS = require('aws-sdk/global');
var Iot = require('aws-sdk/clients/iot');

AWS.config.region = process.env.AWS_REGION;
var iot = new Iot();

module.exports = {

    detachDeleteGreengrassPolicy: async (event, context) => {

        var policyName = event.checkForGreengrass.thingName + '-policy'

        params = { policyName: policyName, target: event.checkForGreengrass.certificateArn };

        await iot.detachPolicy(params).promise();

        var params = {
            policyName: policyName /* required */
        };

        await iot.deletePolicy(params).promise();
    }
}