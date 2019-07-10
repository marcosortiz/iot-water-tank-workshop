var Tank = require('../src/vtank');

DEFAULT_THING_NAME = 'Tank1';
DEFAULT_VERSION = '2.0';

var thingName = DEFAULT_THING_NAME;
if (process.argv.length > 2) {
    thingName = process.argv[2];
} 

var version = DEFAULT_VERSION;
if (process.argv.length > 3) {
    version = process.argv[3];
}

params = {thingName: thingName, version: version, 
    tankLevel: parseInt((Math.random() * 100).toFixed(2))
};
var tank = new Tank(params);