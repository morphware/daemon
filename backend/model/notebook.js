var { spawn, exec }  = require('child_process');
const { conf } = require("../conf")
var LineByLineReader = require('line-by-line');

const JUPYTER_LAB_PORT = conf.jupyterLabPort || 3020;
const builtInPythonLibraries = ['_abc', '_ast', '_bisect', '_blake2', '_codecs', '_codecs_cn', '_codecs_hk', '_codecs_iso2022', '_codecs_jp', '_codecs_kr', '_codecs_tw', '_collections', '_contextvars', '_csv', '_datetime', '_functools', '_heapq', '_imp', '_io', '_json', '_locale', '_lsprof', '_md5', '_multibytecodec', '_opcode', '_operator', '_peg_parser', '_pickle', '_random', '_sha1', '_sha256', '_sha3', '_sha512', '_signal', '_sre', '_stat', '_statistics', '_string', '_struct', '_symtable', '_thread', '_tracemalloc', '_warnings', '_weakref', '_winapi', '_xxsubinterpreters', 'array', 'atexit', 'audioop', 'binascii', 'builtins', 'cmath', 'errno', 'faulthandler', 'gc', 'itertools', 'marshal', 'math', 'mmap', 'msvcrt', 'nt', 'parser', 'sys', 'time', 'winreg', 'xxsubtype', 'zlib']

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

async function findNotebookDependencies() {
    var lr = new LineByLineReader('./notebook.py');
    var words;
    const toInstall = {};

    lr.on('error', function (err) {
        console.log("Error finding dependencies", err)
    });

    lr.on('line', function (line) {
        words = line.split(new RegExp(/\s+/, 'g'));
        if((words[0] === "from" || words[0] === "import") && !toInstall[words[1]] && !builtInPythonLibraries.includes(words[1])){
            toInstall[words[1]] = true;
        }
    });

    lr.on('end', function () {
        try {
            console.log(Object.keys(toInstall))
            const pythonDependencies = Object.keys(toInstall);
            console.info('Installing python dependencies');
            pythonDependencies.forEach(dep => {
                await executeVenv('pip3', 'install', dep);
            });
        } catch (error) {
            console.log("Error installing packages: ", error);
        }
    });
}

module.exports = {runJupyterLabServer: runJupyterLabServer, stopJupyterLabServer: stopJupyterLabServer, findNotebookDependencies: findNotebookDependencies};
