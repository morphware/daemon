'use strict';

const fs = require('fs-extra');
const crypto = require('crypto');
const checkDiskSpace = require('check-disk-space').default;

const {conf} = require('../conf');
const webtorrent = require('../controller/torrent');
const {web3, percentHelper} = require('./contract');
const {wallet} = require('./morphware');
const {Job} = require('./job');

const {exec} = require('./python');

(async function(){
	try{
		console.log(await exec('python3'))

	}catch(error){
		console.error('here error', error)
	}
})()

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

	addToJump(){
		super.addToJump()
		this.constructor.lock = true;
	}

	removeFromJump(){
		try{
			super.removeFromJump()
			this.constructor.lock = false;
		}catch(error){}
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

				// Check to see if this client is accepting work
				if(!this.canTakeWork()) return;

				// Make the job instance
				let job = new this(wallet, event.returnValues);

				// Display for auction times
				console.log('New job found!', (new Date()).toLocaleString());
				console.info('biddingDeadline', job.instanceId, (new Date(parseInt(job.jobData.biddingDeadline*1000))).toLocaleString())
				console.info('revealDeadline', job.instanceId, (new Date(parseInt(job.jobData.revealDeadline*1000))).toLocaleString())

				job.addToJump();
				job.transactions.push(event);
				job.__JobDescriptionPosted(event);
			}
		}catch(error){
			this.removeFromJump();
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

			console.log('bidding data', this.bidData, this.instanceId);

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
				gas: parseInt(parseInt(await action.estimateGas()) * 1.101),
			});

			this.transactions.push({...receipt, event:'bid'});

			return receipt;

		}catch(error){
			this.removeFromJump();
			console.log(`ERROR!!! JobWorker bid`, this.instanceId, error);
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
				gas: parseInt(parseInt(await action.estimateGas()) * 1.101),
			});

			this.transactions.push({...receipt, event:'reveal'});

			return receipt;
		}catch(error){
			this.removeFromJump();
			console.error('ERROR!!! JobWorker reveal', this.instanceId, error);
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
        	gas: parseInt(parseInt(await action.estimateGas()) * 1.101),
		});

		this.transactions.push({...receipt, event: 'shareTrainedModel'});

		return receipt;
	}

	async withdraw(){
		try{

			console.info('Withdrawing on', this.instanceId, (new Date()).toLocaleString());

			let action = this.auctionContract.methods.withdraw();

			let receipt = await action.send({
				gas: parseInt(parseInt(await action.estimateGas()) * 1.101),
			});

			this.transactions.push({...receipt, event: 'withdraw'});

			return receipt;
		}catch(error){
			this.removeFromJump();
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

			// This setTimeout may not be needed.
			// Calculate start of the reveal window
			var now = Math.floor(new Date().getTime());
			var waitTimeInMS = ((parseInt(this.jobData.revealDeadline) * 1000) - now);


			console.log('Revealing bid in', waitTimeInMS/1000, 'at', new Date(now + waitTimeInMS).toLocaleString());

			await this.bid();


			// reveal the bid during the reveal window
			setTimeout(()=>{
				this.reveal();
			}, waitTimeInMS);
		}catch(error){
			this.removeFromJump();
			console.error(`ERROR!!! JobWorker __JobDescriptionPosted`, error)
		}
	}

	async AuctionEnded(event){
		try{
			this.jobData = {...this.jobData, ...event.returnValues};

			if(this.jobData.winner === this.wallet.address){
				console.info('We won!', this.instanceId);

				// If we do win, we will continue to act on events for this
				// instanceID and wait for the poster to fire the next step.
			}else{

				console.log('We lost...', this.instanceId);
				
				// Drop this instance instance from the jump table
				this.removeFromJump();

				// Return your bid escrow
				await this.withdraw();
			}


		}catch(error){
			this.removeFromJump();
			console.error('ERROR!!! `AuctionEnded`', error);
		}
	}

	async UntrainedModelAndTrainingDatasetShared(event){
		try{

			this.downloadPath = `${conf.appDownloadPath}${this.jobData.jobPoster}/${this.id}`;

			// Make sure download spot exists
			fs.ensureDirSync(this.downloadPath);

			// Download the shared files
			let downloads = await webtorrent().downloadAll(this.downloadPath, event.returnValues.untrainedModelMagnetLink, event.returnValues.trainingDatasetMagnetLink);

			console.log('Downloads', downloads);

			console.info('Download done!', this.instanceId, (new Date()).toLocaleString());


            let jupyterNotebookPathname;
            let trainingDataPathname;

            for (let download of downloads) {
                if (download.dn.slice(-5) == 'ipynb') {
        			jupyterNotebookPathname = download.path + '/' + download.dn;
                } else {
        			//TODO: Unzip if needed
        			trainingDataPathname = download.path + '/' + download.dn;
                }
            }

			let pythonPathname = jupyterNotebookPathname.slice(0,-5).concat('py');

            console.log('pythonPathname:', pythonPathname);


			//Convert .ipynb => .py
			await exec('jupyter nbconvert --to script', jupyterNotebookPathname);

			await exec('python3', pythonPathname, trainingDataPathname);

		}catch(error){
			this.removeFromJump();
			console.error('ERROR!!! JobWorker UntrainedModelAndTrainingDatasetShared', this.instanceId, error);
		}

		// when the work is done, share the results
	}
}

/*
Listen for `JobPostedDescription` events. This runs in addition to `Job.events`
*/
if(conf.acceptWork){
	JobWorker.events();
}

module.exports = {JobWorker};
