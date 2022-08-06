'use strict';

const router = require('express').Router();
const {conf, editLocalConf} = require('../conf');

const editKeys = {
	'httpBindAddress':{ type: 'string'},
	'httpPort':{ type: 'number'},
	'privateKey':{ type: 'array'},
	'torrentListenPort':{ type: 'number'},
	'appDownloadPath': {type: 'string'},
	'jupyterLabPort': {type: 'number'},
	'workerGPU': {type: 'string'},
	'role': {type: 'string'},
	'darkMode': {type: 'string'},
	'trainModels': {type: 'string'}
};

router.get('/', async function(req, res, next){
	try{
		return res.json({conf, editKeys});
	}catch(error){
		next(error);
	}
});

router.post('/', async function(req, res, next) {
	try{
		for(let key in req.body){
			if(!Object.keys(editKeys).includes(key)) throw `Can not edit ${key}`
		}

		return res.json(editLocalConf(req.body));

	}catch(error){
		next(error);
	}
});

router.get('/role', async function(req, res, next) {
	try {
		switch(conf.role) {
			case("Poster"): return res.json({role: "poster"});
			case("Worker"): return res.json({role: "worker"});
			case("Validator"): return res.json({role: "validator"});
			default: return res.json({role: "Role Not Set"});
		}
	} catch (error) {
		next(error);
	}
})

module.exports = router;
