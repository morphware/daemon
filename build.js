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
	const buildPackage = extend(true, daemonPackage, {main: 'electron-prod.js', scripts:{postinstall:null}});

	// Remove old build contents
	await fs.remove('./build');

	// Grab the backend
	await fs.copy('./backend', './build/');
	
	// Clean up build directory 
	await fs.remove('./build/node_modules');
	await fs.remove('./build/package-lock.json');

	// Write the new package.json
	await fs.writeJson('./build/package.json', buildPackage);
	
	// Install a clean copy of the packages
	// console.log(await exec(`npm --prefix build install`));

	// Grab the electron run file
	await fs.copy('./electron-prod.js', './build/electron-prod.js');

	// Build the frontend
	console.log(await exec(`npm --prefix frontend run build`));

	// Add the front end to the build
	await fs.move('./frontend/build', './build/www');

	// Build!
	// console.log(await exec('npx electron-packager ./build daemon --platform=win32 --arch=x64 --out dist/ --overwrite'))
	try{
		// console.log(await exec('npx electron-builder install-app-deps
		console.log(await exec('node ./node_modules/electron-builder/cli.js -wl'))
	}catch(error){
		console.log('builder error', error)
	}

})();

