'use strict';

const router = require('express').Router();
const {conf, editLocalConf} = require('../conf');

const editKeys = {
	'httpBindAddress':{ type: 'string'},
	'httpPort':{ type: 'number'},
	'privateKey':{ type: 'array'},
	'acceptWork':{ type: 'boolean'},
	'torrentListenPort':{ type: 'number'},
	'dataPath': {type: 'string'}
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

module.exports = router;