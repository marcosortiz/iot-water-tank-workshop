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
                var tanks = JSON.parse(data.Payload).Items;
                var sorted_tanks = tanks.sort((a,b) => (a.thingName.S > b.thingName.S) ? 1 : ((b.thingName.S > a.thingName.S) ? -1 : 0)); 
                cb(null, sorted_tanks);
            }
        });
    })
}

export default {
    listTanks: listTanks
}