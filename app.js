#!/bin/env nodejs

'use strict';

const conf = require('./conf');

// Load express
const app = require('./express');

// Load GPU node stuff
if(conf.isGPUnode){
	// require('./worker');
}
