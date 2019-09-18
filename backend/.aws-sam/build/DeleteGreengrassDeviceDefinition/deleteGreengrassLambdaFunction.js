'use strict'

var AWS = require('aws-sdk/global');
var Lambda = require('aws-sdk/clients/lambda');

AWS.config.region = process.env.AWS_REGION;
var lambda = new Lambda();

module.exports = {
    deleteGreengrassLambdaFunction: async (event, context) => {
        var params = {
            FunctionName: `${event.checkForGreengrass.thingName}-GreengrassLambdaFunction`
          };
        var data = await lambda.deleteFunction(params).promise();

        return data;
    }
}