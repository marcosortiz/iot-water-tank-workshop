'use strict'

var AWS      = require('aws-sdk/global');
var DynamoDB = require('aws-sdk/clients/dynamodb');

AWS.config.region = process.env.AWS_REGION;
var ddb = new DynamoDB();

module.exports =  {
    checkProvisioning: function(event, context, cb) {
        var data = {
            thingName: event.provisionThing[0].thingName,
            thingArn: event.provisionThing[0].thingArn,
            certificateId: event.provisionThing[1].certificateId,
            certificateArn: event.provisionThing[1].certificateArn,
            policyName: process.env.POLICY_NAME,
            includeGreengrass: event.includeGreengrass || false
        };

        // Write to dynamoDB table
        var ddbParams = {
            TableName: process.env.THINGS_TABLE,
            Item: {
                'thingName': {S: data.thingName},
                'certificateId': {S: data.certificateId},
                'certificateArn': {S: data.certificateArn},
                'policyName': {S: data.policyName},
                'greengrass': {BOOL: data.includeGreengrass}
            }
        };
        console.log('ddbParams', ddbParams);
        ddb.putItem(ddbParams, function(err, resp1) {
            cb(err, data)
        });
    }
}