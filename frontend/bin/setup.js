var fs   = require('fs');
var path = require('path');

var AWS            = require('aws-sdk/global');
var Cloudformation = require('aws-sdk/clients/cloudformation');
var Iot            = require('aws-sdk/clients/iot');


const BACKEND_CONFIG_FILE_PATH = path.normalize(`${path.resolve(__dirname)}/../../config/config.json`);
const FRONTEND_CONFIG_FILE_PATH = path.normalize(`${path.resolve(__dirname)}/../src/config/config.json`);
const KEYS = [
    'IdentityPoolId',
    'UserPoolId',
    'userPoolWebClientId',
    'IotWebPolicy',
    'ListTanks'
];

var region = null;
var stackName = null;

function getRegion() {
    region = process.env.BACKEND_REGION;
    if (region == null) {
        var data = fs.readFileSync(BACKEND_CONFIG_FILE_PATH, 'UTF8');
        region = JSON.parse(data).region;
    }
    return region;
}

function getBackendStackName() {
    stackName = process.env.CFN_STACK_NAME;
    if (stackName == null) {
        var data =  fs.readFileSync(BACKEND_CONFIG_FILE_PATH, 'UTF8');
        stackName = JSON.parse(data).cloudformationStackName;
    }
    return stackName;
}

function find(arr, key) {
    var found = arr.find(function(element) {
        return element['OutputKey'] === key;
    });
    return found['OutputValue'];
}

function fetchConfig(keys, outputs) {
    console.log('Reading backend configuration file ...');
    AWS.config.region = getRegion();
    const cfn = new Cloudformation();
    var stackName = getBackendStackName()
    var params = {
        StackName: stackName
    };

    console.log(`Parsing configuration params from CloudFormation stack ${stackName} ...`);
    cfn.describeStacks(params, function(err, data) {
        if (err) console.log(err, err.stack);
        else {
            var config = { region: region };
            var outputs = data.Stacks[0].Outputs;
            KEYS.forEach(function(key) {
                config[key] = find(outputs, key);
            });
            var iot = new Iot();
            iot.describeEndpoint({endpointType: 'iot:Data-ATS'}, function(err, data){
                if (err) console.log(err, err.stack);
                else {
                    config['iotEndpointAddress'] = data.endpointAddress
                    var content = JSON.stringify(config, null, 4);
                    fs.writeFileSync(FRONTEND_CONFIG_FILE_PATH, content);
                    console.log(`Backend configuration saved to ${BACKEND_CONFIG_FILE_PATH}`);
                }
            });
        }     
    });
}

fetchConfig();