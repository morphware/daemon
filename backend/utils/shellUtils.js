'use strict';

const shellExec = require('child_process').exec;

async function execWithPromise(command)  {
    return new Promise(resolve => {
        shellExec(command, (err, stdout, stderr) => {
            console.log(stdout)
            resolve(err ? stderr : stdout)
        })
     });
};

module.exports = {execWithPromise: execWithPromise};