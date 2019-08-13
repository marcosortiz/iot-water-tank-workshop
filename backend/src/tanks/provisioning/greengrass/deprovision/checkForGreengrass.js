'use strict'

var AWS = require('aws-sdk/global');
var DynamoDB = require('aws-sdk/clients/dynamodb');

AWS.config.region = process.env.AWS_REGION;
var ddb = new DynamoDB.DocumentClient();

module.exports = {
    checkForGreengrass: async (event, context) => {
        
        var params = {
            TableName: process.env.THINGS_TABLE,
            Key:{
                "thingName": event.thingName
            }
        };

        var data = await ddb.get(params).promise();

        if (data.Item && data.Item.greengrass) {
            return data.Item.greengrass;
        }

        return false;
    }
}