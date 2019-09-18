'use strict'

var AWS = require('aws-sdk/global');
var IoT = require('aws-sdk/clients/iot');
var S3 = require('aws-sdk/clients/s3');

AWS.config.region = process.env.AWS_REGION;
var iot = new IoT();
var s3 = new S3();

module.exports = {
  addGreengrassConfigFile: async (event, context) => {

    var configFile = {
      "coreThing": {
        "caPath": "root.ca.pem",
        "certPath": "PREFIX.cert.pem",
        "keyPath": "PREFIX.private.key",
        "thingArn": "THING_ARN",
        "iotHost": "ENDPOINT",
        "ggHost": "greengrass-ats.iot.REGION.amazonaws.com",
        "keepAlive": 600
      },
      "runtime": {
        "cgroup": {
          "useSystemd": "yes"
        }
      },
      "managedRespawn": false,
      "crypto": {
        "principals": {
          "SecretsManager": {
            "privateKeyPath": "file:///greengrass/certs/PREFIX.private.key"
          },
          "IoTCertificate": {
            "privateKeyPath": "file:///greengrass/certs/PREFIX.private.key",
            "certificatePath": "file:///greengrass/certs/PREFIX.cert.pem"
          }
        },
        "caPath": "file:///greengrass/certs/root.ca.pem"
      }
    }

    var params = {
      endpointType: "iot:Data-ATS"
    }

    var data = await iot.describeEndpoint(params).promise();

    var certificateId = event.certificateId;
    var thingArn = event.thingArn;
    var iotHost = data.endpointAddress;
    // var prefix = certificateId.substring(0, 10)
    var prefix = 'core';

    configFile.coreThing.thingArn = thingArn;
    configFile.coreThing.iotHost = iotHost;
    configFile.coreThing.ggHost = configFile.coreThing.ggHost.replace("REGION", process.env.AWS_REGION);
    configFile.coreThing.certPath = configFile.coreThing.certPath.replace("PREFIX", prefix);
    configFile.coreThing.keyPath = configFile.coreThing.keyPath.replace("PREFIX", prefix);
    configFile.crypto.principals.SecretsManager.privateKeyPath = configFile.crypto.principals.SecretsManager.privateKeyPath.replace("PREFIX", prefix);
    configFile.crypto.principals.IoTCertificate.privateKeyPath = configFile.crypto.principals.IoTCertificate.privateKeyPath.replace("PREFIX", prefix);
    configFile.crypto.principals.IoTCertificate.certificatePath = configFile.crypto.principals.IoTCertificate.certificatePath.replace("PREFIX", prefix);

    params = {
      Bucket: process.env.S3_BUCKET,
      Key: certificateId
    };

    data = await s3.getObject(params).promise();

    var json = JSON.parse(data.Body);

    json.configFile = configFile;

    params = {
      Bucket: process.env.S3_BUCKET,
      Key: certificateId,
      Body: JSON.stringify(json, null, 4)
    };

    data = await s3.putObject(params).promise();

    return data;
  }
}