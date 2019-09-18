var AWS = require('aws-sdk/global');
var DynamoDB = require('aws-sdk/clients/dynamodb');

AWS.config.region = "us-east-1";
var ddb = new DynamoDB.DocumentClient();

var params = {
    TableName: "iot-water-tank-workshop-ThingsTable-2FIECS8QVUCC",
    Key:{
        "thingName": "gg13"
    }
};

ddb.get(params, function(err, data) {
    if (err) {
        console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log(data.Item.greengrass);
        console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
    }
});

