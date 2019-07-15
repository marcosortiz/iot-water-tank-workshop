var path = require('path');
var utils = require('./utils');

var AWS            = require('aws-sdk/global');
var StepFunctions  = require('aws-sdk/clients/stepfunctions');
var CloudFormation = require('aws-sdk/clients/cloudformation');

const CONFIG_FILE_PATH = path.normalize(`${path.resolve(__dirname)}/../../../config/config.json`);
var stateMachineArn = null;

function find(arr, key) {
    var found = arr.find(function(element) {
        return element['OutputKey'] === key;
    });
    return found['OutputValue'];
}

function getStateMachineArn(key, stackName, cb) {
    var cfn = new AWS.CloudFormation();
    var params = {
        StackName: stackName
    };
    cfn.describeStacks(params, function(err, data) {
        if (err) console.log(err, err.stack);
        else {
            var outputs = data.Stacks[0].Outputs;
            stateMachineArn = find(outputs, key);
            cb(null, stateMachineArn);
        }       
    });  
}

function runStateMachine(tankName) {
    var sf = new StepFunctions();
    var params = {
        stateMachineArn: stateMachineArn,
        input: `{"thingName": "${tankName}"}`,
    }
    sf.startExecution(params, function(err, data) {
        if(err) console.log(err, err.stack);
        else {
            console.log(`${tankName}: `, data);
        }
    });
}

const CONFIG = utils.readJsonFile(CONFIG_FILE_PATH);
const STACK_NAME = CONFIG.cloudformationStackName;

AWS.config.region = CONFIG.region;

module.exports = {
    run: function run(params, cb) {
        getStateMachineArn(params.key, STACK_NAME, function(err, data) {
            if(err) console.log(err, err.stack);
            else {
                params.tanks.forEach(runStateMachine)
            }
        });
    }
}
