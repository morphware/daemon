
const conf = require('./conf');

// Load express
const app = require('./express.js');

// Load data-sci user listeners
const dataSci = require('./endUser');

// Load GPU node stuff
if(conf.isGPUnode){
	require('./worker');
}
