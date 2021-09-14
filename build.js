'use strict'

const fs = require('fs-extra');
const extend = require('extend');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

(async function(){
	// Will we need to merge the package.json files so electron can build with
	//the correct packages
	const basePackage = require('./package');
	const daemonPackage = require('./backend/package');
	const buildPackage = extend(true, daemonPackage, {devDependencies: basePackage.devDependencies, main: 'electron-prod.js', scripts:{postinstall:null}});

	// Remove old build contents
	await fs.remove('./app-src');

	// Grab the backend
	await fs.copy('./backend', './app-src/');
	
	// Clean up build directory 
	await fs.remove('./app-src/node_modules');
	await fs.remove('./app-src/package-lock.json');
	await fs.remove('./app-src/conf/secrets.js');

	// Write the new package.json
	await fs.writeJson('./app-src/package.json', buildPackage, {spaces: 2});

	// Grab the electron run file
	await fs.copy('./electron-prod.js', './app-src/electron-prod.js');

	// Build the frontend
	console.log(await exec(`npm --prefix frontend run build`));

	// Add the front end to the build
	await fs.move('./frontend/build', './app-src/www');

	// Build!
	try{
		console.log(await exec('node ./node_modules/electron-builder/cli.js -wl'))
	}catch(error){
		console.log('builder error', error)
	}

})();

