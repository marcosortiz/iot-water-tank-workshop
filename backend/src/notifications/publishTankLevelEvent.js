'use strict'

var AWS      = require('aws-sdk/global');
var Ddb      = require('aws-sdk/clients/dynamodb');
var Sns      = require('aws-sdk/clients/sns');

AWS.config.region = process.env.AWS_REGION;
var ddb = new Ddb();
var sns = new Sns();

const NORMAL_EVENT    = 'normal';
const DANGEROUS_EVENT = 'dangerous';

function putItem(event) {
    var params = {
        Item: {
            "tankId": { S: event.tankId },
            "recordedAt": { S: event.recordedAt },
            "event": { S: event.eventName },
            "tankLevel": { S: `${event.tankLevel}` }
        }, 
        ReturnConsumedCapacity: "TOTAL",  
        TableName: process.env.TABLE_NAME
    }
    ddb.putItem(params, function(err, data) {
        if (err) console.log(err, err.stack);
        else     console.log(data);
    });
}

function publish(event) {
    var strDate = new Date(parseInt(event.recordedAt)).toISOString();
    var subject = `${event.eventName} tank level event for ${event.tankId}`;
    var message = '';
    if(event.eventName === DANGEROUS_EVENT) {
        message = `${event.tankId} level recorded at ${strDate} was ${event.tankLevel}% (${event.thresholdName} threshold is ${event.thresholdValue}%).`;
    } else if(event.eventName === NORMAL_EVENT) {
        message = `${event.tankId} level recorded at ${strDate} was ${event.tankLevel}% (back to normal).`
    }

    var params = {
        TopicArn: process.env.TOPIC_ARN,
        Subject: subject,
        Message: message,
        MessageAttributes: {
            'tankId': {
                DataType: "String",
                StringValue: event.tankId
            }
        }
    };
    sns.publish(params, function(err, data) {
        if (err) console.log(err, err.stack);
        else     console.log(data);
    });

}

module.exports =  {
    publishTankLevelEvent: function (event, context, cb) {
        var event_params = {
            recordedAt: `${new Date().getTime()}`,
            tankId: event.payload.detector.keyValue,
            eventName: event.payload.state.stateName,
            tankLevel: event.payload.state.variables.tankLevel
        }
        if (event_params.eventName === DANGEROUS_EVENT) {
            if(event.payload.state.variables.minThresholdExceeded) {
                event_params['thresholdName'] = 'min';
                event_params['thresholdValue'] = event.payload.state.variables.minThreshold;

            } else if(event.payload.state.variables.maxThresholdExceeded) {
                event_params['thresholdName'] = 'max';
                event_params['thresholdValue'] = event.payload.state.variables.maxThreshold;
            }
        }
        console.log(event_params);
        putItem(event_params);
        publish(event_params);
    }
}