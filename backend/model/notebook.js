var { spawn, exec }  = require('child_process');
const { conf } = require("../conf")
const JUPYTER_LAB_PORT = conf.jupyterLabPort || 3020;

async function runJupyterLabServer() {
    console.log("Starting Jupyter Lab...");
    const command = `jupyter lab --port ${JUPYTER_LAB_PORT}`
	let output = exec(command);
    console.log("Output: ", output);
}

async function stopJupyterLabServer() {
    console.log("Stopping Jupyter Lab...");
    const command = `jupyter lab stop ${JUPYTER_LAB_PORT}`
	let output = exec(command);
    console.log("Output: ", output);
}


module.exports = {runJupyterLabServer: runJupyterLabServer, stopJupyterLabServer: stopJupyterLabServer};
