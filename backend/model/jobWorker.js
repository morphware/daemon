'use strict';

const crypto = require('crypto');
const checkDiskSpace = require('check-disk-space').default;

const {conf} = require('../conf');
const webtorrent = require('../controller/torrent');
const {web3, percentHelper} = require('./contract');
const {wallet} = require('./morphware');
const {Job} = require('./job');

/*
JobWorker extends the common functions of Job class and is responsible for
handling functionality a worker node needs.

Instances of this class are created based on the `JobDescriptionPosted` event.
See `__process_event` below for more information

This module starts JobWorker.events() at the end if this file so this classes
`__process_event` is called.

It is recommend you understand the Job class before editing the JobWorker class
*/

class JobWorker extends Job{
	constructor(wallet, jobData){
		super(wallet, jobData);
	}

	// Denote this instance as a Worker type.
	get jobType(){
		return 'worker';
	}

	/*
	this.lock will determine if this client is currently occupied with another
	another job. We will over ride `addTOJump` and `removeFromJump` to set
	locking at the correct times.
	*/

	static lock = false;

	addTOJump(){
		super.addToJump()
		this.constructor.lock = true;
	}

	removeFromJump(){
		super.removeFromJump()
		this.constructor.lock = false;
	}

	// Check to see if the client is ready and willing to take on jobs
	static canTakeWork(){
		return conf.acceptWork && !this.lock;
	}


	/*
	__process_event in the base Job class deals with listen for events on
	current job instances. In order for a worker to start the bidding process,
	we only care about `JobDescriptionPosted` if the client meets cretin run
	time states. We override __precess event below to make that happen.
	*/
	static __process_event(name, instanceId, event){
		try{
			// Check to see if job is already tracked by this client
			if(Object.keys(Job.jobs).includes(instanceId)) return;

			if(name === 'JobDescriptionPosted'){
				
				console.log('new job post!', this.canTakeWork());

				// Check to see if this client is accepting work
				if(!this.canTakeWork()) return;

				// If the current client is accepting new jobs, start a new worker
				let job = new this(wallet, event.returnValues);

				console.log('New job found!', (new Date()).toLocaleString());
				console.info('biddingDeadline', job.instanceId, (new Date(parseInt(job.jobData.biddingDeadline*1000))).toLocaleString())
				console.info('revealDeadline', job.instanceId, (new Date(parseInt(job.jobData.revealDeadline*1000))).toLocaleString())

				job.addToJump();
				job.transactions.push(event);
				job.__JobDescriptionPosted(event);
			}
		}catch(error){
			console.error(`ERROR JobWorker __process_event`, error)
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

		return (await checkDiskSpace(target)).free > size;
	}


	/*
	Actions

	The client can initiate actions against the contract as a worker. Most of
	these result in a action being emitted to the smart contract. 
	*/

	async bid(){
		try{

			console.info('Bidding on', this.instanceId, (new Date()).toLocaleString());

			let approveReceipt = await this.wallet.approve(percentHelper(
				this.jobData.workerReward, 100
			));

			this.bidData = {
				bidAmount: percentHelper(this.jobData.workerReward, 25), // How do we figure out the correct bid?
				fakeBid: false, // How do we know when to fake bid?
				secret: `0x${crypto.randomBytes(32).toString('hex')}`
			};

			let action = this.auctionContract.methods.bid(
				this.jobData.jobPoster,
				parseInt(this.id),
				web3.utils.keccak256(web3.utils.encodePacked(
					this.bidData.bidAmount,
					this.bidData.fakeBid,
					this.bidData.secret
				)),
				this.bidData.bidAmount
			);

			let receipt = await action.send({
				gas: await action.estimateGas(),
			});

			this.transactions.push({...receipt, event:'bid'});

			return receipt;

		}catch(error){
			console.log(`ERROR!!! JobWorker bid`, error);
			throw 'error';
		}
	}

	async reveal(){
		try{

			console.info('Revealing on', this.instanceId, (new Date()).toLocaleString());

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

			this.transactions.push({...receipt, event:'reveal'});

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

			console.info('Withdrawing on', this.instanceId, (new Date()).toLocaleString());

			let action = this.auctionContract.methods.withdraw();

			let receipt = await action.send({
				gas: parseInt(parseInt(await action.estimateGas()) * 1.101),
				// gas: await action.estimateGas()
			});

			this.transactions.push(receipt)

			return receipt;
		}catch(error){
			console.error('ERROR JobWorker withdraw', error)
		}
	}


	/*
	Events

	This sections maps events the clients listens for to actionable events.
	All of the following methods are intended to be called by the
	`Job.__processEvent` in the `Job` class. See the Events sections in the Job
	class for more information.
	*/

	async __JobDescriptionPosted(event){
		// This is prefixed with '__' so its not auto called by Job.events and
		// ONLY called when this class wants to call it.

		try{

			// Confirm we have enough free space to perform the job
/*			if(!await this.__checkDisk(this.trainingDatasetSize, conf.appDownloadPath)){
				console.info('Not enough free disk space, passing');

				// Drop this instance instance from the jump table
				this.removeFromJump();

				return false;
			}*/

			// This setTimeout may not bee needed.
			// Calculate start of the reveal window
			var now = Math.floor(new Date().getTime());
			var biddingDeadline = parseInt(this.jobData.biddingDeadline);
			var waitTimeInMS1 = ((biddingDeadline*1000 - now)+40000);

			console.log('Revealing bid in', waitTimeInMS1/1000, 'at', new Date(now + waitTimeInMS1).toLocaleString());

			await this.bid();

			// reveal the bid during the reveal window
			setTimeout(()=>{
				this.reveal();
			}, waitTimeInMS1);
		}catch(error){
			console.error(`ERROR!!! JobWorker __JobDescriptionPosted`, error)
		}
	}

	async AuctionEnded(event){
		try{
			this.jobData = {...this.jobData, ...event.returnValues};

			if(this.jobData.winner !== this.wallet.address){

				// Return your bid escrow
				await this.withdraw();
				
				// Drop this instance instance from the jump table
				this.removeFromJump();
			}

			console.info('We won!', this.instanceId);

			// If we do win, we will continue to act on events for this
			// instanceID and wait for the poster to fire the next step.

		}catch(error){
			console.error('ERROR!!! `AuctionEnded`', error);
		}
	}

	async UntrainedModelAndTrainingDatasetShared(event){
		console.log(event)
		// get files and do work
		// when the work is done, share the results
	}
}

/*
Listen for `JobPostedDescription` events. This runs in addition to `Job.events`
*/

JobWorker.events();

module.exports = {JobWorker};
