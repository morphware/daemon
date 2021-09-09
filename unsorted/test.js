const { spawn }  = require('child_process');

var model_file = './datalake/worker_node/downloads/0xd03ea8624C8C5987235048901fB614fDcA89b117/0/jupyter-notebook.ipynb'
console.log('model_file:',model_file)

// Run the Jupyter notebook //////////////
var dataToSend;
// spawn new child process to call the python script

// TODO Add `detached:true` to dict-like object parameterized at the end of `spawn`?
const python = spawn('python3', [`${model_file}`], {shell: true});


// collect data from script
python.stdout.on('data', function (data) {
    console.log('Pipe data from python script ...');
    dataToSend = data.toString();
});
 // in close event we are sure that stream from child process is closed
python.on('close', (code) => {
    console.log(`child process close all stdio with code ${code}`);
    // FIXME Do something else here instead
    // send data to browser
    // res.send(dataToSend)

    console.log(dataToSend);
});
////////////////
