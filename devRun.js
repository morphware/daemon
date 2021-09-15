#!/usr/bin/env node

const {spawn} = require('child_process');
const BASE_DIR = __dirname
const fs = require('fs');
const conf =require('./backend/conf')
var tasks = []


function startBackend(){
	try{
		let child = spawn('npm', ['start', '--',...process.argv],{
			cwd: BASE_DIR+'/backend',
		});

		tasks.push(child);

		child.stdout.on('data', function(data){
		 	console.log(data.toString());
		});

		child.stderr.on('data', function(data){
		 	console.error(data.toString());
		});

		child.on('exit', function(code){
			console.error('Wxpress failed, killing dev server');
			console.error('Wxpress exited with code: ' + code);
			killAll();
			// process.exit(1);
		});
	}catch(error){
		console.error('backend died', error);
		killAll();
		// process.exit(1);
	}
};

function startReact(){
	let eleteronLock = false
	try{
		let child = spawn('npm', ['start'], {
			cwd: BASE_DIR+'/frontend',
			env:{
				BROWSER: "none",
				...process.env
			}
		});

		tasks.push(child);

		child.stdout.on('data', function(data){
		 	console.log(data.toString());
		 	if(!eleteronLock && data.toString().includes('Compiled successfully!')){
		 		startElectron();
		 		eleteronLock = true;
		 	}	
		});

		child.stderr.on('data', function(data){
		 	console.error(data.toString());
		});

		child.on('exit', function(code){
			console.error('Webpack failed, killing dev server');
			console.error('Webpack exited with code: ' + code);
			killAll();
			// process.exit(1);
		});
	}catch(error){
		console.error('React died', error);
		killAll();
		// process.exit(1);
	}
};

function startElectron(){
	try{
		// Inject conf for react to read.
		fs.writeFileSync('preload.js', `localStorage.setItem('url', "${conf.httpAddress}:${conf.httpPort}")`);
		
		let child = spawn('npx', ['nodemon', '-w', 'electron.js', '--exec', 'electron', '.'], {
			cwd: BASE_DIR,
			env:{
				...process.env
			}
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
			// process.exit(1);
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
}

startBackend();
startReact();

// "dev": "concurrently -k \"BROWSER=none npm run start-frontend\" \"npm:electron\" \"npm run start-backend\"",
//     "electron": "wait-on tcp:3000 && electron .",
//     "windev": "concurrently -k \"cross-env BROWSER=none npm run start-frontend\" \"npm:electron\" \"npm run start-backend\""