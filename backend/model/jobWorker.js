'use strict';

const {conf} = require('../conf');
const {web3} = require('./contract');
const webtorrent = require('../controller/torrent');
const {Job} = require('./job');
const {wallet} = require('./morphware');


class JobWorker extends Job{
	constructor(data){
		super(data)
	}

	get jobType(){
		return 'worker';
	}

	static async new(event){
		if(conf.acceptWork){
			// Make new job instance
			let job = new this({
				jobData: event.returnValue,
				wallet: wallet
			});

			// Hold new instance in the jump table
			Job.jobs[job.id] = job;

			// Start the transaction history
			job.transactions.push(event);

			// Kick off the job
			await job.JobDescriptionPosted();
		}
	}

	static __process_event(event){
		let name = event.event;

		/*
		we want to get to the object that holds `returnValues`. Sometime its in the
		event, and sometimes there is returnValue in a `events` object.
		*/
		if(event.events && event.events[name]){
			event = event.events[name]
		}

		// If the current client is accepting new jobs, start a new worker
		if(name === 'JobDescriptionPosted'){
			this.new(event);
		}
	}

	// Contract actions
	async bid(){

		this.auctionContract.bid = {
			bidAmount: 11, // How do we figure out the correct bid?
			fakeBid: false, // How do we know when to fake bid?
			secret: '0x6d6168616d000000000000000000000000000000000000000000000000000000' // What is this made from?
		}

		let action = this.auctionContract.methods.bid(
			this.jobdata.jobPoster, // why do we need this?
			parseInt(this.id),
			web3.utils.keccak256(web3.utils.encodePacked(this.bid.bidAmount,this.bid.fakeBid,this.bid.secret)),
			bidAmount
		);

		let receipt = await action.send({
			gas: await action.estimateGas()
		});

		this.transactions.push(receipt);

		return receipt;
	}

	async reveal(){
		let action = this.auctionContract.methods.reveal(
			this.jobPoster,
			parseInt(this.id),
			[this.bid.bidAmount],
			[this.bid.fakeBid],
			[this.bid.secret]
		);

		let receipt = await action.send({
			gas: await action.estimateGas()
		});

		this.transactions.push(receipt);

		return receipt;
	}

	async shareTrainedModel(){
		let action = jobFactoryContract.methods.shareTrainedModel(
            this.jobData.jobPoster,
            parseInt(this.id),
            trainedModelMagnetLink, // get this data
            parseInt(trainingErrorRate) // get this data
        );

		let receipt = await action.send({
			gas: await action.estimateGas()
		});

		this.transactions.push(receipt);

		return receipt;
	}

	// Contract events
	async JobDescriptionPosted(event){
		console.log('Inside JobWorker JobDescriptionPosted...');
		if(!conf.acceptWork) return;

		var job = event.returnValues;

		if(!await checkDisk(job.trainingDatasetSize)){
			console.info('not enough free disk space, passing');
			return false;
		}

		await this.bid();

		// reveal the bid later
		setTimeout(()=>{
			this.reveal();
		}, 1000);
	}

	async AuctionEnded(event){
		try{
			console.log('Inside JobWorker procAuctionEnded...', event); // XXX

			var results = event.returnValues;

			if(results.winner !== this.wallet.address){
				// Remove this job from the job jump table if we did not win
				delete this.constructor.jobs[this.id]
			}

		}catch(error){
			console.error('ERROR!!! `AuctionEnded`', error)
		}
	}

	async UntrainedModelAndTrainingDatasetShared(event){
		// get files and do work
		// when the work is done, share the results
	}
}

// Listen for new posted jobs
JobWorker.events();

module.exports = {JobWorker};
