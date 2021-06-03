var Tank = require('../src/vtank');

DEFAULT_THING_NAME = 'Tank1';
DEFAULT_VERSION = '2.0';

var thingName = DEFAULT_THING_NAME;
if (process.argv.length > 2) {
    thingName = process.argv[2];
} 

let initialTankLevel = parseInt(process.argv[3]);
if ( initialTankLevel === undefined || Number.isNaN(initialTankLevel) ) initialTankLevel = 50;
let targetTankLevel = parseInt(process.argv[4]);
if ( targetTankLevel === undefined || Number.isNaN(targetTankLevel) ) targetTankLevel = 80;
let period = parseInt(process.argv[5]);
if (period === undefined || Number.isNaN(period) ) period = 300;

params = {
    thingName: thingName,
    initialTankLevel: initialTankLevel,
    targetTankLevel: targetTankLevel,
    period: period,
    tankLevel: initialTankLevel
};

var tank = new Tank(params);