var Constants = require(`${__dirname}/constants`);

function handleOtaUpdate(msg, bot) {
    var state = bot.props.telemetry;
    if (msg.version === undefined) {
        throw new Error('Missing required param: version');
    } else if (state.version === msg.version) {
        throw new Error(`I am already running version ${msg.version}`);
    } else {
        bot.setState({version: msg.version});
        return {status: 'ok'};
    }
}

function handleStartDrain(msg, bot) {
    var state = bot.props.telemetry;
    if (state.status === Constants.DRAINING_STATUS) {
        throw new Error('I am already draining');
    } else {
        bot.setState({startDrainRequested: true});
        return {status: 'ok'};
    }
}

function handleStandBy(msg, bot) {
    var state = bot.props.telemetry;
    if (state.status === Constants.STANDBY_STATUS) {
        throw new Error('I am already on standby');
    } else {
        bot.setState({standByRequested: true});
        return {status: 'ok'};
    }
}

function handleEnableAutoFilling(bot) {
    var state = bot.props.telemetry
    if (state.autoCirculateEnabled == true) {
        throw new Error('Auto filling is already enabled.');
    } else {
        bot.setState({autoCirculateEnabled: true});
        return {status: 'ok'};
    } 
}

function handleDisableAutoFilling(bot) {
    var state = bot.props.telemetry
    if (state.autoCirculateEnabled == false) {
        throw new Error('Auto filling is already disabled.');
    } else {
        bot.setState({autoCirculateEnabled: false});
        return {status: 'ok'};
    }
}

function handleStartFilling(bot) {
    var state = bot.props.telemetry
    if (state.status == Constants.FILLING_STATUS) {
        throw new Error('I am already filling.');
    } else {
        bot.setState({status: Constants.FILLING_STATUS});
        return {status: 'ok'};
    }
}

function processCmd(msg, bot) {
    if (msg.cmd === Constants.OTA_UPDATE_CMD) {
        return handleOtaUpdate(msg, bot);
    } else if (msg.cmd === Constants.START_DRAIN_CMD) {
        return handleStartDrain(msg, bot);
    } else if (msg.cmd === Constants.STAND_BY_CMD) {
        return handleStandBy(msg, bot);
    } else if (msg.cmd === Constants.ENABLE_AUTO_FILLING_CMD) {
        return handleEnableAutoFilling(bot);
    } else if (msg.cmd === Constants.DISABLE_AUTO_FILLING_CMD) {
        return handleDisableAutoFilling(bot);
    } else if (msg.cmd === Constants.START_FILLING) {
        return handleStartFilling(bot);
    } else {
        throw new Error(`Unsupported cmd: ${msg.cmd}`);
    }
}

module.exports = class MessageHandler {

    static handle(stringMsg, bot) {
        var msg, error, resp;
        try {
            var msg = JSON.parse(stringMsg);
            resp = processCmd(msg, bot);
        } catch(err) {
            resp = { error: err.message };
        }
        return JSON.stringify(resp);
    }
}