'use strict';

const checkDiskSpace = require('check-disk-space').default;

const {conf} = require('../conf');
const {web3, percentHelper} = require('./contract');
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

			// Check to see if job already exists
			if(Object.keys(Job.jobs).includes(event.returnValues.id)) return ;

			// Make new job instance
			let job = new this({
				jobData: event.returnValues,
				wallet: wallet
			});

			// Hold new instance in the jump table
			Job.jobs[job.id] = job;

			// Start the transaction history
			job.transactions.push(event);

			// Kick off the job
			await job.__JobDescriptionPosted(event);
		}
	}

	static __process_event(event){
		let name = event.event;

		/*
		we want to get to the object that holds `returnValues`. Sometime its in the
		event, and sometimes there is returnValue in a `events` object.
		*/
		if(event.events && event.events[name]){
			event = event.events[name];
		}

		// If the current client is accepting new jobs, start a new worker
		if(name === 'JobDescriptionPosted'){
			this.new(event);
		}
	}

	// Helpers
	async __checkDisk(size, target){
		/*
		This does not account for size on disk(blocks used) vs file size, for
		larger files this may be an issue.

		This also not not account for space needed to extract or decrypt
		operations.
		*/

		console.log('data size', size);
		let freeSize = await checkDiskSpace(target);
		console.log('data from check util', this.id, freeSize);

		return freeSize.free > size;
	}

	// Contract actions
	async bid(){
		try{

			let approveReceipt = await this.wallet.approve(percentHelper(
				this.jobData.workerReward, 100
			));

			console.log('approveReceipt', approveReceipt.events.Approval.returnValues)

			this.bidData = {
				bidAmount: percentHelper(this.jobData.workerReward, 25), // How do we figure out the correct bid?
				fakeBid: false, // How do we know when to fake bid?
				secret: '0x6d6168616d000000000000000000000000000000000000000000000000000'+Math.floor(Math.random() * 5)+Math.floor(Math.random() * 5)+Math.floor(Math.random() * 5) // What is this made from?
			};


			console.log('bid data',
				this.jobData.jobPoster, // why do we need this?
				parseInt(this.id),
				web3.utils.keccak256(web3.utils.encodePacked(this.bidData.bidAmount,this.bidData.fakeBid,this.bidData.secret)),
				this.bidData.bidAmount
			)

			let action = this.auctionContract.methods.bid(
				this.jobData.jobPoster, // why do we need this?
				parseInt(this.id),
				web3.utils.keccak256(web3.utils.encodePacked(
					this.bidData.bidAmount,
					this.bidData.fakeBid,
					this.bidData.secret
				)),
				this.bidData.bidAmount
			);

			let receipt = await action.send({
				gas: await action.estimateGas()
			});

			this.transactions.push(receipt);

			return receipt;

		}catch(error){
			console.log(`ERROR!!! JobWorker bid`, error);
			throw 'error';
		}
	}

	async reveal(){
		try{

			console.log('reveal data',
				this.jobData.jobPoster,
				parseInt(this.id),
				[this.bidData.bidAmount],
				[this.bidData.fakeBid],
				[this.bidData.secret]
			);

			let action = this.auctionContract.methods.reveal(
				this.jobData.jobPoster,
				parseInt(this.id),
				[this.bidData.bidAmount],
				[this.bidData.fakeBid],
				[this.bidData.secret]
			);

			let receipt = await action.send({
				gas: await action.estimateGas()
			});

			this.transactions.push(receipt);

			return receipt;
		}catch(error){
			console.error('ERROR!!! JobWorker reveal', error);
		}
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

	async withdraw(){
		try{
			let action = this.auctionContract.methods.withdraw();

			let receipt = await action.send({
				gas: await action.estimateGas()
			});

			this.transactions.push(receipt)

			return receipt;
		}catch(error){
			console.error('ERROR JobWorker withdraw', error)
		}
	}

	// Contract events
	async __JobDescriptionPosted(event){
		try{
			if(!conf.acceptWork) return;

			var job = event.returnValues;

			if(!await this.__checkDisk(job.trainingDatasetSize, conf.appDownloadPath)){
				console.info('not enough free disk space, passing');
				return false;
			}

			await this.bid();


			var currentTimestamp = Math.floor(new Date().getTime() / 1000);


            var biddingDeadline = parseInt(this.jobData.biddingDeadline);

            var safeDelay = 5;
            var waitTimeInMS1 = ((biddingDeadline - currentTimestamp)+90) * 1000;





			// reveal the bid later
			setTimeout(()=>{
				this.reveal();
			}, waitTimeInMS1);
		}catch(error){
			console.error(`ERROR!!! JobWorker __JobDescriptionPosted`, error)
		}
	}

	async AuctionEnded(event){
		try{
			var results = event.returnValues;

			if(results.winner !== this.wallet.address){

				await this.withdraw();
				// vickreyAuction.withdraw({from:accounts[1]});
				

				// Remove this job from the job jump table if we did not win
				delete this.constructor.jobs[this.id];

			}

		}catch(error){
			console.error('ERROR!!! `AuctionEnded`', error);
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
