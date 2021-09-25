#!/usr/bin/env node
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const {spawn} = require('child_process');
const fs = require('fs');
const {conf} =require('./backend/conf');
var pids = [];


function startBackend(){
	try{
		let child = spawn('npm', ['start', '--',...process.argv],{
			cwd: __dirname+'/backend',
			env:{
				...process.env
			},
			shell: true
		});

		pids.push(child);

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
			cwd: __dirname+'/frontend',
			env:{
				BROWSER: "none",
				...process.env
			},
			shell: true,
		});

		pids.push(child);

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
		fs.writeFileSync('preload.js', `
			localStorage.setItem('url', "${conf.httpAddress}:${conf.httpPort}")
			localStorage.setItem('environment', "${conf.environment}")
			window.renderer = window.require("electron").ipcRenderer;
		`);
		
		let child = spawn('npx', ['nodemon', '-w', 'electron.js', '--exec', 'electron', '.'], {
			cwd: __dirname,
			env:{
				...process.env
			},
			shell: true
		});

		pids.push(child);

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
	}
};

function killAll(){
	for(let pid of pids){
		pid.kill();
	}
	process.exit(1);
}

startBackend();
startReact();
