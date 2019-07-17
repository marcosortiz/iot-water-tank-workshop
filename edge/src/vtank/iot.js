'use strict'

var fs   = require('fs');
var path = require('path');
var iot      = require('aws-iot-device-sdk');
var Constants = require(`${__dirname}/constants`);
var MessageHandler = require(`${__dirname}/msgHandler`);


const VERISIGN_ROOT_CA_FILENAME = 'verisign-root-ca.pem'
const CA_CERT = fs.readFileSync(
    `${path.resolve(__dirname)}/${VERISIGN_ROOT_CA_FILENAME}`,'utf8');

var thingShadow = null;
var bot = null;

module.exports =  {
    bootstrap: function(caller) {
        bot = caller;
        var opts = {
            privateKey: Buffer.from(bot.props.certsProps.keyPair.PrivateKey, 'utf8'),
            clientCert: Buffer.from(bot.props.certsProps.certificatePem, 'utf8'),
            caCert: Buffer.from(CA_CERT, 'utf8'),
            clientId: bot.props.thingName,
            host: Constants.IOT_HOST,
        }
        thingShadow = iot.thingShadow(opts);

        thingShadow.on('connect', function() {
            bot.props.logger.info('aws-iot-event connect');
            bot.props.logger.info(`Registering for shadow events for to ${bot.props.thingName}`);
            thingShadow.register(bot.props.thingName, {}, function(){
                thingShadow.subscribe(bot.props.cmdsTopic);
                var state = {
                    state: {
                        reported: caller.props.shadow
                    }
                }

                thingShadow.update(bot.props.thingName, state );
            });
            
            bot.props.logger.info(`Subscribing to ${bot.props.cmdsTopic}`);
            thingShadow.subscribe(bot.props.cmdsTopic);
            thingShadow.on('message', function(t, payload) {
                const resp = MessageHandler.handle(payload.toString(), bot);
                thingShadow.publish(bot.props.cmdAckTopic, resp);
            });
        });

        thingShadow.on('reconnect', function() {
            bot.props.logger.info('aws-iot-event reconnect');
        });
        thingShadow.on('close', function() {
            bot.props.logger.info('aws-iot-event close');
        });
        thingShadow.on('offline', function() {
            bot.props.logger.info('aws-iot-event offline')
        });
        thingShadow.on('error', function() {
            bot.props.logger.info('aws-iot-event error');
        });
        thingShadow.on('end', function() {
            bot.props.logger.info('aws-iot-event end');
        });
        
        thingShadow.on('status', function(thingName, stat, clientToken, stateObject) {
            bot.props.logger.info(`Shadow update ${stat} for ${thingName}`);
        });
        thingShadow.on('delta', function(thingName, stateObject) {
            console.log('received delta on '+thingName+': '+
                        JSON.stringify(stateObject));
        });

        thingShadow.on('timeout', function(thingName, clientToken) {
            bot.props.logger.info(`received timeout on ${thingName} with token ${clientToken}`);
        });

    },
    sendTelemetry: function (topic, data) {
        thingShadow.publish(topic, data);
    },
    updateShadow: function(thingName, stateObject) {
        thingShadow.update(thingName, stateObject);
    }
}