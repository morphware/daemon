#!/usr/bin/env node

const {spawn} = require('child_process');
const BASE_DIR = __dirname
const fs = require('fs');
const conf =require('./backend/conf')
var tasks = []

process.env.NODE_ENV = 'development';

function startBackend(){
	try{
		let child = spawn('npm', ['start', '--',...process.argv],{
			cwd: BASE_DIR+'/backend',
			env:{
				...process.env
			},
			shell: true
		});

		tasks.push(child);

		child.stdout.on('data', function(data){
		 	console.log(data.toString());
		});

		child.stderr.on('data', function(data){
		 	console.error(data.toString());
		});

		child.on('exit', function(code){
			console.error('Express failed, killing dev server');
			console.error('Express exited with code: ' + code);
			killAll();
		});
	}catch(error){
		console.error('backend died', error);
		killAll();
	}
};

function startReact(){
	let electronLock = false
	let doKill = true
	try{
		let child = spawn('npm', ['start'], {
			cwd: BASE_DIR+'/frontend',
			env:{
				BROWSER: "none",
				...process.env
			},
			shell: true,
		});

		tasks.push(child);

		child.stdout.on('data', function(data){
		 	console.log('std', data.toString());
		 	if(!electronLock && data.toString().includes('Compiled successfully!')){
		 		startElectron();
		 		electronLock = true;
		 	}	
		 	if(!electronLock && data.toString().includes('Something is already running on port')){
		 		startElectron();
		 		doKill = false;
		 		electronLock = true;
		 		child.kill();
		 	}
		});

		child.stderr.on('data', function(data){
		 	console.error('error', data.toString());
		});

		child.on('exit', function(code){
			console.error('React exited with code'. code,);
			if(doKill) killAll();
		});
	}catch(error){
		console.error('React died', error);
		killAll();
	}
};

function startElectron(){
	try{
		// Inject conf for react to read.
		fs.writeFileSync('preload.js', `localStorage.setItem('url', "${conf.httpAddress}:${conf.httpPort}")`);
		
		let child = spawn('npx', ['nodemon', '-w', 'electron.js', '--exec', 'electron', '.'], {
			cwd: BASE_DIR,
			env:{
				ELECTON_DEV: 1,
				...process.env
			},
			shell: true
		});

		tasks.push(child);

		child.stdout.on('data', function(data){
		 	console.log(data.toString());
		});

		child.stderr.on('data', function(data){
		 	console.error(data.toString());
		});

		child.on('exit', function(code){
			console.error('Webpack failed, killing dev server');
			console.error('Webpack exited with code: ' + code);

			killAll();
		});	
	}catch(error){
		console.error('electron died')
		killAll();
		// process.exit(1)
	}
};

function killAll(){
	for(let task of tasks){
		task.kill();
	}
	process.exit(1);
}

startBackend();
startReact();

// "dev": "concurrently -k \"BROWSER=none npm run start-frontend\" \"npm:electron\" \"npm run start-backend\"",
//     "electron": "wait-on tcp:3000 && electron .",
//     "windev": "concurrently -k \"cross-env BROWSER=none npm run start-frontend\" \"npm:electron\" \"npm run start-backend\""