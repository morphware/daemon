'use strict';

const extend = require('extend');
const fs = require('fs-extra');
const environment = process.env.NODE_ENV || 'development';

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

var conf = load('./base', true);

var appDataPath = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share")
appDataPath += `/${conf.appName}/${environment}/local.json`

if(!fs.pathExistsSync('./conf/secrets.js')){
	conf.localAppData = appDataPath;

	if(!fs.pathExistsSync(appDataPath)){
		console.log('making appData file ', appDataPath);
		fs.ensureDirSync(appDataPath.replace('/local.json', ''));
		fs.writeJsonSync(appDataPath, {});
	}
}

module.exports = extend(
	true, // enable deep copy
	conf,
	load(`./${environment}`),
	load(conf.localAppData || './secrets'),
	{environment}
);
