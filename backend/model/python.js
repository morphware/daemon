'use strict';

const fs = require('fs-extra');
const util = require('util');
var { spawn, exec }  = require('child_process');
exec = util.promisify(exec);
const {conf} = require('../conf');


const VIRTUAL_ENV = `${conf.appDataPath}env`;
const PATH = `${VIRTUAL_ENV}/${process.platform === 'win32' ? 'Scripts' : 'bin'}:${process.env.PATH}`

async function makeVenv(){

	console.info('Creating python venv', VIRTUAL_ENV);
	let env = await exec(`python3 -m venv ${VIRTUAL_ENV}`);

	console.log('env', env);

	console.info('Installing python dependencies');

  let req = fs.existsSync("/usr/src/app/requirements.txt")
    ? "/usr/src/app/requirements.txt"
    : `${__dirname}/../../resources/share/python/requirements.txt`;

	let install = await executeVenv('pip3', 'install', '-r', req);

	console.info('install', install)

	await fs.writeJson(`${VIRTUAL_ENV}/morphware.json`, {
		version: conf.version,
		date: new Date().toLocaleString()
	});
}

function checkVenv(){
	try{
		let envJSON = require(`${VIRTUAL_ENV}/morphware`);
		if(envJSON.version === conf.version){
			return true
		}
	}catch(error){
		return false;
	}
}

function executeVenv(command, ...args){
	let std = {
		out: [],
		err: [],
		code: null
	};

	return new Promise((resolve, reject)=>{

		console.log("Executing");
		console.log("Command:  ", command);
		console.log("PATH:  ", PATH)
		console.log("VIRTUAL_ENV:  ", VIRTUAL_ENV);


		const child = spawn(command, args, {
			shell: true,
			env: {
				PATH: PATH,
				VIRTUAL_ENV: VIRTUAL_ENV,
				...process.env,
			}
		});

		child.stdout.on('data', function (data) {
			console.log('Pipe data from Python script ...', data.toString());
			std.out.push(data.toString());
		});

		child.stderr.on('data', function(data){
			console.log('std error', data.toString());
			std.err.push(data.toString());
		});

		child.on('error', function(data){
			console.error('ERROR!!! `executeNoteBook` child error', data);
			reject(data);
		});

		child.on('close', (code) => {
			console.log(`child process close all stdio with code ${code}`);

			std.code = code;

			// check exit code here
			resolve(std);
		});
	});
}

async function executeWrapper(...args){

	if(!checkVenv()){
		console.log("Creating Environment");
		await makeVenv();
	}

	console.log("Environment Created");

	return await executeVenv(...args);

}

module.exports = {exec: executeWrapper};
