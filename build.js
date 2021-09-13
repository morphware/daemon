'use strict'

const fs = require('fs-extra');
const extend = require('extend');
const util = require('util');
const exec = util.promisify(require('child_process').exec);


const basePackage = require('./package');
const daemonPackage = require('./backend/package');
const buildPackage = extend(true, basePackage, daemonPackage, {main: 'electron-prod.js', scripts:{postinstall:null}});

(async function(){

	await fs.remove('./build');

	await fs.copy('./backend', './build/');
	
	await fs.remove('./build/node_modules');
	await fs.writeJson('./build/package.json', buildPackage);
	await fs.remove('./build/package-lock.json');

	await fs.copy('./electron-prod.js', './build/electron-prod.js');

	console.log(await exec(`npm --prefix frontend run build`));

	console.log(await exec(`npm --prefix build install`));

	await fs.move('./frontend/build', './build/www');

	console.log(await exec('npx electron-packager ./build morphware --platform=linux --arch=x64 --overwrite'))

})();

