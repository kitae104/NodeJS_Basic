const {exec} = require('child_process');

let process = exec('dir');

process.stdout.on('data', function(data) {
    console.log(data.toString());
});

process.stderr.on('data', function(data) {
   console.error(data.toString());
});