'use strict'

var fs   = require('fs');
var path = require('path');

var TankCore = require(`${__dirname}/core`);
const TankLogger = require(`${__dirname}/logger`);
var Constants = require(`${__dirname}/constants`);
var Iot = require(`${__dirname}/iot`);

const DEFAULT_TELEMETRY_INTERVAL = 2000 // in milliseconds

const DEFAULT_INITIAL_TANK_LEVEL = 50;
const DEFAULT_TARGET_TANK_LEVEL  = 80;
const DEFAULT_PERIOD = 300 // 15 * 60 (seconds)

function getStatus(initialTankLevel, targetTankLevel) {DEFAULT_TARGET_TANK_LEVEL
    if (initialTankLevel < targetTankLevel) {
        return Constants.FILLING_STATUS;
    } else if (initialTankLevel > targetTankLevel) {
        return Constants.DRAINING_STATUS;
    } else {
        return Constants.STATIC_STATUS;
    }
}

function initProps(obj, opts) {
    obj.props = opts;
    const placeholder = Constants.DEVICE_ID_PLACEHOLDER;
    obj.props.telemetryTopic = opts.telemetryTopic || Constants.TELEMETRY_TOPIC_TEMPLATE.replace(placeholder, obj.props.thingName);
    obj.props.certsProps = null;
    
    let initialTankLevel = opts.initialTankLevel;
    if (initialTankLevel === undefined) initialTankLevel = DEFAULT_INITIAL_TANK_LEVEL;
    
    let targetTankLevel = opts.targetTankLevel;
    if (targetTankLevel === undefined) targetTankLevel = DEFAULT_TARGET_TANK_LEVEL;

    obj.props.telemetry = {
        initialTankLevel: initialTankLevel,
        targetTankLevel: targetTankLevel,
        period: opts.period || DEFAULT_PERIOD,
        status: getStatus(initialTankLevel, targetTankLevel),
        tankLevel: initialTankLevel
    };
    obj.props.shadow = {
        telemetryPerMinRate: 4,
        maxTankLevelThreshold: 85
    }
    obj.props.logger = TankLogger.getLogger(obj.props.thingName);
}

module.exports = class Tank {

    constructor(opts={}) {
        initProps(this, opts);

        //
        // Load keys and certs and then start the bot.
        //
        var _this = this;
        TankCore.bootstrap(this.props.thingName, function(err, data) {
            if(err) {
                console.log(err, err.stack);
                return;
            } else {
                _this.props.certsProps = data;
                _this.start();
            }
        });
    }

    start() {
        Iot.bootstrap(this);
        var _this = this;
        setInterval(
            function() {
                TankCore.updateState(_this.props.telemetry, _this.props.logger);
            }, 
            1000
        );
        _this.props.logger.info(`Will send telemetry data every ${DEFAULT_TELEMETRY_INTERVAL} seconds to ${_this.props.telemetryTopic}`);
        setInterval(
            function() {
                var arr = TankCore.getTelemetryData();
                var data = { telemetry: arr};
                Iot.sendTelemetry(_this.props.telemetryTopic, JSON.stringify(data) );
            }, 
            DEFAULT_TELEMETRY_INTERVAL
        );
    }

    setState(props) {
        var state = this.props.telemetry;
        for (var key in props) {
            if (state.hasOwnProperty(key)) {
                state[key] = props[key];
            }
        }
    }
}