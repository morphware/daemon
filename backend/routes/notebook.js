'use strict';

const router = require('express').Router();
const {JobPoster} = require('../model/jobPoster');

router.post('/start', async function (req, res, next) {
	try{
		await JobPoster.startNotebook();
		return res.json({status: 'success'});
	}catch(error){
		next(error);
	}
});

router.post('/stop', async function (req, res, next) {
	try{
		await JobPoster.stopNotebook();
		return res.json({status: 'success'});
	}catch(error){
		next(error);
	}
});

module.exports = router;
