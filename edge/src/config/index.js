var config = require('./config.json');
                    
module.exports = {
  region: config.region,
  ThingsTable: config.ThingsTable,
  iotKeysAndCertsBucket: config.iotKeysAndCertsBucket,
  iotEndpointAddress: config.iotEndpointAddress,
};
