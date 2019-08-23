import { Auth } from 'aws-amplify';
import Lambda from 'aws-sdk/clients/lambda';
import Config from '../config';

function listTanks(cb) {
    Auth.currentCredentials()
    .then(credentials => {
        const lambda = new Lambda({
            apiVersion: '2015-03-31',
            credentials: Auth.essentialCredentials(credentials),
            region: Config.region,
        });
        var params = {
            FunctionName: Config.lambda.ListTanks,
            InvocationType: "RequestResponse",
            Payload: JSON.stringify({})
        };
        lambda.invoke(params, function(err, data) {
            if (err) cb(err, null);
            else {
                if(JSON.parse(data.Payload).Items === undefined) console.log(data);
                var tanks = JSON.parse(data.Payload).Items;
                var sorted_tanks = tanks.sort((a,b) => (a.thingName.S > b.thingName.S) ? 1 : ((b.thingName.S > a.thingName.S) ? -1 : 0)); 
                cb(null, sorted_tanks);
            }
        });
    })
}

function queryTankLevelEvents(tankId, cb) {
    Auth.currentCredentials()
    .then(credentials => {
        const lambda = new Lambda({
            apiVersion: '2015-03-31',
            credentials: Auth.essentialCredentials(credentials),
            region: Config.region,
        });
        var params = {
            FunctionName: Config.lambda.QueryTankLevelEvents,
            InvocationType: "RequestResponse",
            Payload: JSON.stringify({tankId: tankId})
        };
        lambda.invoke(params, function(err, data) {
            if (err) cb(err, data);
            else {
                if(JSON.parse(data.Payload).Items === undefined) console.log(data);
                let resp = JSON.parse(data.Payload).Items;
                cb(err, resp);
            }
        });
    })
}

function getMetricData(tankId, cb) {
    Auth.currentCredentials()
    .then(credentials => {
        const lambda = new Lambda({
            apiVersion: '2015-03-31',
            credentials: Auth.essentialCredentials(credentials),
            region: Config.region,
        });
        var params = {
            FunctionName: Config.lambda.GetMetricData,
            InvocationType: "RequestResponse",
            Payload: JSON.stringify({tankId: tankId})
        };
        lambda.invoke(params, function(err, data) {
            if (err) cb(err, data);
            else {
                let resp = JSON.parse(data.Payload);
                cb(err, resp);
            }
        });
    })
}

export default {
    getMetricData: getMetricData,
    listTanks: listTanks,
    queryTankLevelEvents: queryTankLevelEvents
}