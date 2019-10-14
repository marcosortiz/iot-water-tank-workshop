'use strict'

var AWS        = require('aws-sdk/global');
var CloudWatch = require('aws-sdk/clients/cloudwatch');

const METRICS_NAMESPACE             = 'iotWaterTankDemo';
const TANK_LEVEL_METRIC             = 'tankLevel';
const TANK_LEVEL_DIMENSION          = 'tank';

AWS.config.region = process.env.AWS_REGION;
var cw = new CloudWatch();

module.exports =  {
    getMetricData: function (event, context, cb) {
        var now = new Date();
        var startTime = new Date(now - (1000*60*15));
        var params = {
            StartTime: startTime,
            EndTime: now,
            ScanBy: 'TimestampAscending',
            MetricDataQueries: [
                {
                    Id: TANK_LEVEL_METRIC, /* required */
                    MetricStat: {
                        Metric: { /* required */
                          Dimensions: [
                            {
                              Name: TANK_LEVEL_DIMENSION, /* required */
                              Value: event.tankId /* required */
                            }
                          ],
                          MetricName: TANK_LEVEL_METRIC,
                          Namespace: METRICS_NAMESPACE
                        },
                        Period: '1', /* required */
                        Stat: 'Average', /* required */
                        Unit: 'Percent'
                    },
                    ReturnData: true
                }
            ]
        };

        cw.getMetricData(params, function(err, data) {
            if (err) console.log(err, err.stack);
            else {
                let resp = [];
                let timestamps = data.MetricDataResults[0].Timestamps;
                let values = data.MetricDataResults[0].Values;

                timestamps.forEach( function (timestamp, i){
                    resp.push( {recordedAt: timestamp, tankLevel: values[i]} );
                });
                cb(err, resp);
            }
        });
    }
}