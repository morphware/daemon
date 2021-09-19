'use strict';

const conf = require('../conf');
const {web3} = require('./contract');
const webtorrent = require('../controller/torrent');
const {Job} = require('./job');

let jobFactoryAbi = require(`./../abi/${conf.jobFactoryAbiPath}`);
let jobFactoryContract = new web3.eth.Contract(jobFactoryAbi, conf.jobFactoryContractAddress);

var auctionFactoryAbi = require(`./../abi/${conf.auctionFactoryABIPath}`);
var auctionFactoryContract = new web3.eth.Contract(auctionFactoryAbi,conf.auctionFactoryContractAddress);

class JobWorker extends Job{
	constructor(data){
		super(data)
	}

	static async new(event){
		try{

			console.log("NEW JOBBBBBBB!!!!!!!!!!!!!")
			console.log(event)
			return;
			let job = new this.constructor(data);

			let jobData = await job.post();

			JobPoster.jobs[jobData.returnValues.id] = job;

			return job;
		}catch(error){
			throw error;
		}
	}

	// Contract actions

	async bid(){
		console.log('bidding', this);
	}

	// Contract events
	async JobDescriptionPosted(event){
		console.log('Inside JobWorker JobDescriptionPosted...');
		if(!conf.acceptWork) return;
        
        return ;
        await this.bidding()


		var job = event.returnValues;

		if(!await checkDisk(job.trainingDatasetSize)){
            console.info('not enough free disk space, passing');
            return false;
        }

        // await processPostedJob(job);
	}

}

console.log('injecting job...')
// Inject
Job.workerCreator = JobWorker.new

module.exports = {JobWorker};
