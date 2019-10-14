'use strict'

var AWS = require('aws-sdk/global');
var DynamoDB = require('aws-sdk/clients/dynamodb');
var Greengrass = require('aws-sdk/clients/greengrass');

AWS.config.region = process.env.AWS_REGION;
var ddb = new DynamoDB.DocumentClient();
var greengrass = new Greengrass();

module.exports = {
    getGreengrassGroup: async (event, context) => {
        
        var params = {
            TableName: process.env.THINGS_TABLE,
            Key:{
                "thingName": event.thingName
            }
        };

        var data = await ddb.get(params).promise();

        var groupId = data.Item.greengrassGroupId;

        var response = {
            GroupId: groupId
        }

        params = {
            GroupId: groupId
        };

        data = await greengrass.getGroup(params).promise();

        params = {
            GroupId: groupId,
            GroupVersionId: data.LatestVersion
        };

        response.GroupVersionId = data.LatestVersion;

        data = await greengrass.getGroupVersion(params).promise();

        if (data.CoreDefinitionVersionArn) {
            response.CoreDefinitionId = data.CoreDefinitionVersionArn.split('/')[4]
        }

        if (data.LoggerDefinitionVersionArn) {
            response.LoggerDefinitionId = data.LoggerDefinitionVersionArn.split('/')[4]
        }

        if (data.FunctionDefinitionVersionArn) {
            response.FunctionDefinitionId = data.FunctionDefinitionVersionArn.split('/')[4]
        }

        if (data.DeviceDefinitionVersionArn) {
            response.DeviceDefinitionId = data.DeviceDefinitionVersionArn.split('/')[4]
        }

        if (data.SubscriptionDefinitionVersionArn) {
            response.SubscriptionDefinitionId = data.SubscriptionDefinitionVersionArn.split('/')[4]
        }

        if (data.ResourceDefinitionVersionArn) {
            response.ResourceDefinitionId = data.ResourceDefinitionVersionArn.split('/')[4]
        }

        return response;
    }
}