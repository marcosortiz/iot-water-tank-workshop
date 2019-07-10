var fs   = require('fs');
var path = require('path');

var yaml           = require('js-yaml');
var AWS            = require('aws-sdk/global');
var Cloudformation = require('aws-sdk/clients/cloudformation');
var Iot            = require('aws-sdk/clients/iot');

const KEYS = [ 'ThingsTable', 'iotKeysAndCertsBucket'];

const CONFIG_FILE_PATH = path.normalize(`${path.resolve(__dirname)}/../../config/config.json`);
const EDGE_CONFIG_FILE_PATH = path.normalize(`${path.resolve(__dirname)}/../src/config/config.json`);

var config = null;
var region = null;

function getConfigValue(key) {
    if (config === null) {
        var contents = fs.readFileSync(CONFIG_FILE_PATH,'utf8');
        config = JSON.parse(contents);
    }
    return config[key]
}

function getBackEndStackName() {
    return process.env.CFN_STACK_NAME || getConfigValue('cloudformationStackName');
}

function getBackEndRegion() {
    return process.env.REGION || getConfigValue('region');
}

function find(arr, key) {
    var found = arr.find(function(element) {
        return element['OutputKey'] === key;
    });
    return found['OutputValue'];
}

function fetchConfig(keys, outputs) {
    console.log('Reading backend configuration file ...');
    region = getBackEndRegion();
    AWS.config.region = region;

    const cfn = new Cloudformation();
    var stackName = getBackEndStackName()
    var params = {
        StackName: stackName
    };

    console.log(`Parsing configuration params from CloudFormation stack ${stackName} ...`);
    cfn.describeStacks(params, function(err, data) {
        if (err) console.log(err, err.stack);
        else {
            var config = {region: region};
            var outputs = data.Stacks[0].Outputs;
            KEYS.forEach(function(key) {
                config[key] = find(outputs, key);
            });
            var iot = new Iot();
            iot.describeEndpoint({}, function(err, data){
                if (err) console.log(err, err.stack);
                else {
                    config['iotEndpointAddress'] = data.endpointAddress;
                    var content = JSON.stringify(config, null, 4);
                    fs.writeFileSync(EDGE_CONFIG_FILE_PATH, content);
                    console.log(`Backend configuration saved to ${EDGE_CONFIG_FILE_PATH}`);
                }
            });
        }     
    });
}

fetchConfig();
