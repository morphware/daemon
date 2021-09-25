'use strict';

const router = require('express').Router();
const {JobPoster} = require('../model/jobPoster');
const {Job} = require('../model/job');

// The wallet should be injected into the req obj
const {wallet} = require('../model/morphware');


router.post('/', async function (req, res, next) {
	try{

		let job = await JobPoster.new({...req.body, wallet});

		return res.json({status: 'success', job: job.id});

	}catch(error){
		next(error);
	}
});

router.get('/', async function(req, res, next){
	try{
		let jobs = {};

		for(let [id, job] of Object.entries(Job.jobs)){
			jobs[id] = {
				type: job.jobType,
				jobData: job.jobData,
				transactions: job.transactions,
			}
		}

		return res.json({jobs});

	}catch(error){
		next(error);
	}
});

module.exports = router;
