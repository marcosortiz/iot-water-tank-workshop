'use strict'

var AWS      = require('aws-sdk/global');
var DynamoDB = require('aws-sdk/clients/dynamodb');

AWS.config.region = process.env.AWS_REGION;
var ddb = new DynamoDB();


module.exports =  {
    listTanks: function (event, context, cb) {
        var params = { TableName: process.env.THINGS_TABLE };
        var thingName = event.thingName || '';


        if(thingName !== '') {
            params['FilterExpression'] = "begins_with(thingName, :tn)"
            params['ExpressionAttributeValues'] = {":tn": {"S":thingName}}
        }
        ddb.scan(params, function(err, data) {
            if (err) cb(err, null);
            else {
                if(cb) cb(null, data);
            }
        });
    }
}