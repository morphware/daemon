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
	const buildPackage = extend(true, daemonPackage, {/*devDependencies: basePackage.devDependencies,*/ main: 'electron.js', scripts:{postinstall:null}});

	console.info('Remove old build contents');
	await fs.remove('./app-src');

	console.info('Grab the backend')
	await fs.copy('./backend', './app-src/');
	
	console.info('Clean up build directory ')
	await fs.remove('./app-src/node_modules');
	await fs.remove('./app-src/package-lock.json');
	await fs.remove('./app-src/conf/secrets.js');

	console.info('Write the new package.json');
	await fs.writeJson('./app-src/package.json', buildPackage, {spaces: 2});

	console.info('Grab the electron run file')
	await fs.copy('./electron.js', './app-src/electron.js');

	console.info('Build the frontend');
	let frontEndBuild = await exec(`npm --prefix frontend run build`)
	console.log(!frontEndBuild.stderr ? 'success' : frontEndBuild.stderr );

	console.info('Move the fronend files to the build directory.');
	await fs.move('./frontend/build', './app-src/www');

	try{
		// console.info('Install build Dependencies');
		// console.log(await exec('npm --prefix app-src install'));
		// console.log(await exec('./app-src/node_modules/.bin/electron-builder install-app-deps'));

		console.info('Building')
		console.log(await exec('./node_modules/.bin/electron-builder -wl'));
	}catch(error){
		console.log('builder error', error)
	}

})();

