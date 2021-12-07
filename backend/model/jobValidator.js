'use strict';

const fs = require('fs-extra');
const checkDiskSpace = require('check-disk-space').default;

const {conf} = require('../conf');
const webtorrent = require('../controller/torrent');
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
JobValidator extends the common functions of Job class and is responsible for
handling functionality a validator node needs.

Instances of this class are created based on the `JobDescriptionPosted` event.
See `__process_event` below for more information

This module starts JobValidator.events() at the end if this file so this classes
`__process_event` is called.

It is recommend you understand the Job class before editing the JobValidator class
*/

class JobValidator extends Job{
	constructor(wallet, jobData){
		super(wallet, jobData);
	}

	// Denote this instance as a Validator type.
	get jobType(){
		return 'validator';
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
	static canValidate(){
		return !this.lock;
	}


	/*
	__process_event in the base Job class deals with listen for events on
	current job instances. In order for a validator to start the bidding process,
	we only care about `JobDescriptionPosted` if the client meets cretin run
	time states. We override __precess event below to make that happen.
	*/
	static __process_event(name, instanceId, event){
		try{

            // console.log("Processing Event: ", name);
            // console.log("Event Return Values: ", event.returnValues);

			// Check to see if job is already tracked by this client
			if(Object.keys(Job.jobs).includes(instanceId)) return;

			if(name === 'TestingDatasetShared'){

				// Check to see if this client is accepting work
				if(!this.canValidate()) return;

				// Make the job instance
				let job = new this(wallet, event.returnValues);

				// Display for auction times
				console.log('New Validation job found', (new Date()).toLocaleString());

				console.log("JobData: ", this.jobData);

				console.info('Error Rate', event.returnValues.targetErrorRate);
				console.info('Trained Model Magnet URI', event.returnValues.trainedModelMagnetLink);
				console.info('Testing Dataset Magnet URI', event.returnValues.testingDatasetMagnetLink);

				job.addToJump();
				job.transactions.push(event);
				job.__TestingDatasetShared(event);
			}
		}catch(error){
			this.removeFromJump();
			console.error(`ERROR JobValidator __process_event`, error)
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

	The client can initiate actions against the contract as a validator. Most of
	these result in a action being emitted to the smart contract. 
	*/


	/*
	Events

	This sections maps events the clients listens for to actionable events.
	All of the following methods are intended to be called by the
	`Job.__processEvent` in the `Job` class. See the Events sections in the Job
	class for more information.
	*/

    async __TestingDatasetShared(event){
        try {
            let job = event.returnValues;
            console.log("Job: ", job);

			this.downloadPath = `${conf.appDownloadPath}${this.jobData.jobPoster}/${this.id}`;

            // Make sure download spot exists
			fs.ensureDirSync(this.downloadPath);

            // Download the shared files
			let downloads = await webtorrent().downloadAll(this.downloadPath, event.returnValues.trainedModelMagnetLink, event.returnValues.testingDatasetMagnetLink);
			console.log('Downloads', downloads);

            //Test the modal and get loss
			// await exec('python3 unsorted/validator_node.py 2> /dev/null | tail -n 1', trainingDataPathname);
			let std = await exec('pwd');
			console.log("pwd STDOUT: ", std);

			std = await exec('python3 unsorted/validator_node.py');
			console.log("Python STDOUT (removed 2> /dev/null): ", std);


			std = await exec('python3 unsorted/validator_node.py 2> /dev/null | tail -n 1');
			console.log("Python STDOUT: ", std);
			//TODO: Check if std returns correct array		

            let retVal = std.out[0].slice(0,-1);
            console.log('retVal', retVal);
            console.log('retVal type:', typeof retVal);

			let error = parseInt(retVal * 100);
			error = 100 - error;

			const maximumAllowableError = parseInt(event.returnValues.targetErrorRate);

			console.info('Download done!', this.instanceId, (new Date()).toLocaleString());

			console.log("Training Error: ", error);
			console.log("Required Max Error: ", maximumAllowableError);

			if(error <= maximumAllowableError) {
				//Approve the job if loss is less than target loss
				let action = this.jobContract.methods.approveJob(
					job.jobPoster,
					parseInt(job.id),
					job.trainedModelMagnetLink
				)
				
				let receipt = await action.send({
					gas: await action.estimateGas()            
				});

				console.log("receipt: ", receipt);
			}
			else {
				throw(`This model isn't accurate enough. Error is ${error} Maximum Allowable Error is ${maximumAllowableError}`);
			}
        } catch (error) {
            // this.removeFromJump();
			console.error(`ERROR!!! JobValidator __JobDescriptionPosted`, error)
        }
    }
}

/*
Listen for `JobPostedDescription` events. This runs in addition to `Job.events`
*/
if(conf.role === "Validator"){
	JobValidator.events();
}

module.exports = {JobValidator};
