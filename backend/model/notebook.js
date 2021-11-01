var { spawn, exec }  = require('child_process');
const { conf } = require("../conf")
const JUPYTER_LAB_PORT = conf.jupyterLabPort || 3020;

async function runJupyterLabServer() {
    console.log(`Starting Jupyter Lab on port ${JUPYTER_LAB_PORT}...`);
    console.log("dataPath: ", conf.appDownloadPath)
    const command = `jupyter lab --port ${JUPYTER_LAB_PORT} --notebook-dir ${conf.appDownloadPath}`
	let output = exec(command);
    console.log("Output: ", output);
}

async function stopJupyterLabServer() {
    console.log(`Stopping Jupyter Lab on port ${JUPYTER_LAB_PORT}...`);
    const command = `jupyter lab stop ${JUPYTER_LAB_PORT}`
	let output = exec(command);
    console.log("Output: ", output);
}


module.exports = {runJupyterLabServer: runJupyterLabServer, stopJupyterLabServer: stopJupyterLabServer};
