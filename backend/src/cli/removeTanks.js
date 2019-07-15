var stepFunction = require('./stepFunctions')

const STEP_FUNCTION_OUTPUT_KEY = 'RemoveThing';
const TANKS = ['Tank1', 'Tank2', 'Tank3', 'Tank4', 'Tank5', 'Tank6'];

var params = {
    key: STEP_FUNCTION_OUTPUT_KEY,
    tanks: TANKS
}

console.log('Removing tanks ...')
stepFunction.run(params, function(err, data) {
    if(err) console.log(err, err.stack);
    else {
        console.log(data);
    }
})
