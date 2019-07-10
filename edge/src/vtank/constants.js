var Config = require(`${__dirname}/../config`);

const DEVICE_ID_PLACEHOLDER = '<deviceId>';

module.exports = {    
    STANDBY_STATUS : 'standby',
    OFF_STATUS     : 'off',
    FILLING_STATUS: 'filling',
    DRAINING_STATUS : 'draining',

    OTA_UPDATE_CMD            : 'otaUpdate',
    START_DRAIN_CMD            : 'startDrain',
    STAND_BY_CMD              : 'standby',
    ENABLE_AUTO_FILLING_CMD  : 'enableAutoFilling',
    DISABLE_AUTO_FILLING_CMD : 'disableAutoFilling',
    START_FILLING            : 'startFilling',

    REGION: Config.region,
    S3_BUCKET: Config.iotKeysAndCertsBucket,
    IOT_THINGS_TABLE: Config.ThingsTable,
    IOT_HOST: Config.iotEndpointAddress,

    DEVICE_ID_PLACEHOLDER   : DEVICE_ID_PLACEHOLDER,
    TELEMETRY_TOPIC_TEMPLATE: `tanks/${DEVICE_ID_PLACEHOLDER}/telemetry`,
    CMD_TOPIC_TEMPLATE      : `tanks/${DEVICE_ID_PLACEHOLDER}/cmds`,
    ACK_SUFFIX              : 'ack',
}
