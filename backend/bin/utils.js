var Utils = require('utils');
var path = require('path');

const CONFIG_FILE_PATH = path.normalize(`${path.resolve(__dirname)}/../../config/config.json`);

function readFile(path) {
    return fs.readFileSync(path, 'utf8');
}

module.exports =  {
    readJsonFile: function readJsonFile(path) {
        var str = readFile(path);
        return JSON.parse(str);
    }
}