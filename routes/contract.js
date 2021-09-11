'use strict';

const router = require('express').Router();
const {JobPoster} = require('../model/jobPoster');

// The wallet should be injected into the req obj
const {wallet} = require('../model/morphware');


router.post('/', async function (req, res, next) {
    try{

        let job = await JobPoster.new({...req.body, wallet});

        return res.json({status: 'success', job: job.jobID});

    }catch(error){
        next(error)
    }
});

module.exports = router;
