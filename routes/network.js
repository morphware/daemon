'use strict';

const router = require('express').Router();
const {provider} = require('../model/contract');

router.get('/', async function(req, res, next){
	res.json({
		status: provider.connected
	});
});

module.exports = router;
