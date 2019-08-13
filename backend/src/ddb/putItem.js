'use strict'

var AWS      = require('aws-sdk/global');
var Ddb      = require('aws-sdk/clients/dynamodb');

AWS.config.region = process.env.AWS_REGION;
var ddb = new Ddb();

module.exports =  {
    putItem: function (event, context, cb) {
        var now = new Date();
        var tankId = event.payload.detector.keyValue;
        var eventName = event.payload.state.stateName;
        var tankLevel = event.payload.state.variables.tankLevel;
        var params = {
            Item: {
                "tankId": { S: tankId },
                "recordedAt": { S: `${now.getTime()}` },
                "event": { S: eventName },
                "tankLevel": { S: `${tankLevel}` }
            }, 
            ReturnConsumedCapacity: "TOTAL",  
            TableName: process.env.TABLE_NAME
        }
        console.log(params);
        ddb.putItem(params, function(err, data) {
            if (err) console.log(err, err.stack);
            else     console.log(data);
        });
    }
}