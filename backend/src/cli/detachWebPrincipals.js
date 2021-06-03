var path = require('path');
var utils = require('./utils');

var AWS            = require('aws-sdk/global');
var Iot  = require('aws-sdk/clients/iot');
var CloudFormation = require('aws-sdk/clients/cloudformation');

const CONFIG_FILE_PATH = path.normalize(`${path.resolve(__dirname)}/../../../config/config.json`);
const CONFIG = utils.readJsonFile(CONFIG_FILE_PATH);
const STACK_NAME = CONFIG.cloudformationStackName;

AWS.config.region = CONFIG.region;

var cfn = new AWS.CloudFormation();
var iot = new Iot();


function find(arr, key) {
    var found = arr.find(function(element) {
        return element['OutputKey'] === key;
    });
    return found['OutputValue'];
}

function getPolicyName(key, stackName, cb) {
    
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

console.log('Detaching principals from IotWebPolicy ...');
getPolicyName('IotWebPolicy', STACK_NAME, function(err, data) {
    var policyName = null;
    if(err) console.log(err, err.stack);
    else {
        policyName = data;
        var params = {
            policyName: policyName,
        }
        iot.listPolicyPrincipals(params, function(err1, data1) {
            if(err1) console.log(err, err.stack);
            else {
                data1.principals.forEach(function(principal){
                    var detachParams = {
                        policyName: policyName,
                        principal: principal
                    };
                    iot.detachPrincipalPolicy(detachParams, function(err2, data2){
                        if (err2) {
                           console.log(err2, err2.stack);
                        } else {
                            console.log(`Successfully detached ${principal} from ${policyName}`);
                        }
                    });
                });
            }
        });
    }
});
