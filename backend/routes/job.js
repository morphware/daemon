'use strict';

const router = require('express').Router();
const {JobPoster} = require('../model/jobPoster');
const {JobWorker} = require('../model/jobWorker');
const {JobValidator} = require('../model/jobValidator')
const {Job} = require('../model/job');

// The wallet should be injected into the req obj
const {wallet} = require('../model/morphware');


router.post('/', async function (req, res, next) {
	try{

		let job = await JobPoster.new(wallet, req.body);

		return res.json({status: 'success', job: job.instanceId});

	}catch(error){
		next(error);
	}
});

router.get('/stream', async function(req, res, next){
	try{
		return res.json({stream: Job.stream});
	}catch(error){
		next(error);
	}
});

router.get('/', async function(req, res, next){
	try{
		let jobs = {};

		for(let instanceId in Job.jobs){
			jobs[instanceId] = Job.jobs[instanceId].asObject
		}

		return res.json({jobs, canTakeWork: JobWorker.canTakeWork()});

	}catch(error){
		next(error);
	}
});

router.get('/:instanceId', async function(req, res, next){
	try{

		return res.json(Job.jobs[req.params.instanceId].asObject);

	}catch(error){
		next(error);
	}
});


module.exports = router;
