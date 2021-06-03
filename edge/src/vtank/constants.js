var Config = require(`${__dirname}/../config`);

const DEVICE_ID_PLACEHOLDER = '<deviceId>';

module.exports = {  
    DRAINING_STATUS: 'draining',
    EMPTY_STATUS:    'empty',
    FILLING_STATUS:  'filling',
    FULL_STATUS:     'full',
    STATIC_STATUS:   'static',

    REGION: Config.region,
    S3_BUCKET: Config.iotKeysAndCertsBucket,
    IOT_THINGS_TABLE: Config.ThingsTable,
    IOT_HOST: Config.iotEndpointAddress,

    DEVICE_ID_PLACEHOLDER   : DEVICE_ID_PLACEHOLDER,
    TELEMETRY_TOPIC_TEMPLATE: `tanks/${DEVICE_ID_PLACEHOLDER}/telemetry`,
}
