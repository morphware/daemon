'use strict';

const extend = require('extend');
const fs = require('fs-extra');
var args = require('args');
const environment = process.env.NODE_ENV || 'production';
var conf;

try{

	function load(filePath, required){
		try {
			return require(filePath);
		} catch(error){
			if(error.name === 'SyntaxError'){
				console.error(`Loading ${filePath} file failed!\n`, error);
				process.exit(1);
			} else if (error.code === 'MODULE_NOT_FOUND'){
				console.warn(`No config file ${filePath}! This may cause issues...`);
				if (required){
					process.exit(1);
				}
				return {};
			}else{
				console.dir(`Unknown error in loading ${filePath} config file.\n`, error);
			}
		}
	};

	conf = {...load('./base', true), environment};


	if(!fs.pathExistsSync('./conf/secrets.js')){
		var appDataPath = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share")
		appDataPath += `/${conf.appName}/${environment}/local.json`
		
		conf.localAppData = appDataPath;

		if(!fs.pathExistsSync(appDataPath)){
			console.log('making appData file ', appDataPath);
			fs.ensureDirSync(appDataPath.replace('/local.json', ''));
			fs.writeJsonSync(appDataPath, {});
		}
	}

	// Set the command line argument options
	args
	  .option('httpPort', 'http port')
	  .option('electronDev', 'Load chrome dev tools')
	  .option('acceptWork', 'Accepting jobs')
	  .option('wallet', 'Wallet Object', undefined, value=>{
	  	return JSON.parse(value);
	  })

	// Create the exported conf object
	module.exports = extend(
		true, // enable deep copy
		conf, // Base conf gets loaded fist
		load(`./${environment}`), // Load any environment settings
		load(conf.localAppData || './secrets'), // Load local settings
		args.parse(process.argv), // Settings applied at runtime trump all!
	);

}catch(error){
	console.error('ERROR in conf loading', environment, error)
	console.error(conf)
	console.error(process.argv)
	process.exit(1);
}

