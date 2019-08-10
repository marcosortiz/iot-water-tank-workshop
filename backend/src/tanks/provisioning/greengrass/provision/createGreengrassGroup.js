'use strict'

var AWS = require('aws-sdk/global');
var DynamoDB = require('aws-sdk/clients/dynamodb');
var Greengrass = require('aws-sdk/clients/greengrass');

AWS.config.region = process.env.AWS_REGION;
var ddb = new DynamoDB.DocumentClient();
var greengrass = new Greengrass();

module.exports = {
    createGreengrassGroup: async (event, context) => {
        
        var params = {
            Name: `${event.thingName}-Group`,
        };

        var data = await greengrass.createGroup(params).promise();
        
        params = {
            TableName: process.env.THINGS_TABLE,
            Key:{
                "thingName": event.thingName
            },
            UpdateExpression: "set greengrassGroupId = :i",
            ExpressionAttributeValues:{
                ":i":data.Id
            },
            ReturnValues:"UPDATED_NEW"
        };

        var updateData = await ddb.update(params).promise(); 

        return data;
    }
}