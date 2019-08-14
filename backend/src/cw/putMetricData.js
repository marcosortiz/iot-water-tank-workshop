'use strict'

var AWS        = require('aws-sdk/global');
var CloudWatch = require('aws-sdk/clients/cloudwatch');
var jsonSize   = require('json-size');

const METRICS_NAMESPACE             = 'iotWaterTankDemo';
const TELEMETRY_DELAY_METRIC        = 'telemetryDelay';
const TELEMETRY_PACKAGE_SIZE_METRIC = 'telemetryPacketSize';
const TANK_LEVEL_METRIC             = 'tankLevel';

AWS.config.region = process.env.AWS_REGION;
var cw = new CloudWatch();

module.exports =  {
    putMetricData: function (event, context, cb) {
        var now = new Date();
        var last_recorded_at = null;
        var telemetry = event.telemetry || [];
        var params = {
            MetricData: [],
            Namespace: METRICS_NAMESPACE
        };
        telemetry.forEach(function(datapoint){
            last_recorded_at = new Date(datapoint.recorded_at);
            var metricData = {
                MetricName: TANK_LEVEL_METRIC,
                Dimensions: [
                    {
                        Name: 'tank',
                        Value: event.dimension
                    }
                ],
                StorageResolution: 1,
                Timestamp: last_recorded_at,
                Unit: 'Percent',
                Value: datapoint.tankLevel
            }
            params.MetricData.push(metricData);
        });

        params.MetricData.push({
            MetricName: TELEMETRY_DELAY_METRIC,
            Dimensions: [
                {
                    Name: 'tank',
                    Value: event.dimension
                }
            ],
            StorageResolution: 1,
            Timestamp: now,
            Unit: 'Milliseconds',
            Value: now - last_recorded_at
        });

        params.MetricData.push({
            MetricName: TELEMETRY_PACKAGE_SIZE_METRIC,
            Dimensions: [
                {
                    Name: 'tank',
                    Value: event.dimension
                }
            ],
            StorageResolution: 1,
            Timestamp: now,
            Unit: 'Bytes',
            Value: jsonSize(event.telemetry)
        });

        cw.putMetricData(params, function(err, data) {
            if (err) console.log(err, err.stack);
        });
    }
}