'use strict'

var AWS      = require('aws-sdk/global');
var DynamoDB = require('aws-sdk/clients/dynamodb');

AWS.config.region = process.env.AWS_REGION;
var ddb = new DynamoDB();

const MAX_ITEMS = 15;

module.exports =  {
    queryEvents: function (event, context, cb) {
        var params = { 
            TableName: process.env.TABLE_NAME,
            ExpressionAttributeValues: {
                ":v1": {
                  S: event.tankId
                }
            }, 
            KeyConditionExpression: "tankId = :v1", 
            ScanIndexForward: false,
            Limit: MAX_ITEMS,
        };

        ddb.query(params, function(err, data) {
            if (err) console.log(err, err.stack);
            cb(err, data);
        });
    }
}