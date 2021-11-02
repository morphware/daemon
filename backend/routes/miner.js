'use strict';

const router = require('express').Router();
const {JobWorker} = require('../model/jobWorker');

router.post('/start', async function (req, res, next) {
	try{
		JobWorker.startMining()
		return res.json({status: 'success'});
	}catch(error){
		next(error);
	}
});

router.post('/stop', async function (req, res, next) {
	try{
		JobWorker.stopMining();
		return res.json({status: 'success'});
	}catch(error){
		next(error);
	}
});

module.exports = router;
