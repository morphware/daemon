'use strict';

const {web3} = require('./contract');
const {conf} = require('../conf');
const {Job} = require('./job');
const webtorrent = require('../controller/torrent');


class JobPoster extends Job{
	constructor(data){
		super(data);
	}

	get jobType(){
		return 'poster';
	}

	// Wrapper for creating a new job
	// This only exists because a proper constructor can not be async and we
	// have to wait for the job id
	static async new(data){
		try{
			let job = new this(data);

			let jobData = await job.post();

			Job.jobs[job.id] = job;

			return job;
		}catch(error){
			throw error;
		}
	}


	// Helpers
	async __parsePostFile(data){
		/* parse the passed file paths from the passed instance data*/
		try{
			this.data.files = {};
			let fileFields = [
				'jupyterNotebook',
				'trainingData',
				'testingData'
			]

			for(let field of fileFields){
				let {magnetURI} = await webtorrent.findOrSeed(data[field]);
				this.data.files[field] = {
					path: data[field],
					magnetURI: magnetURI
				};
			}

		}catch(error){
			console.log('error __parsePostFile', error);
			throw error;
		}
	}


	// Contact actions
	async post(){
		try{

			// Transfer founds for the contract to hold in escrow
			let transfer = await this.wallet.send(
				conf.auctionFactoryContractAddress,
				this.data.workerReward
			);

			this.transactions.push(transfer);
			
			// Seed files
			this.__parsePostFile(this.data);

			// Calculate the auction timing
			// This is a hack to deal with block timing. All timing will be
			// reworked soon and this is the last we will speak of it...
			var biddingDeadline = Math.floor(new Date().getTime() / 1000) + parseInt(this.data.biddingTime)
			var revealDeadline = biddingDeadline+30  // TODO Replace this

			// Post the new job
			let action = this.jobContract.methods.postJobDescription(
				parseInt(this.data.trainingTime),
				parseInt(32000), // get size this.data['training-data']
				parseInt(this.data.errorRate),
				web3.utils.toWei((this.data.workerReward*.1).toString()),
				biddingDeadline,
				revealDeadline,
				web3.utils.toWei(this.data.workerReward.toString())
			);

			let receipt = await action.send({
				gas: await action.estimateGas()
			});

			this.transactions.push(receipt);

			// Gather data about the job
			this.jobData = receipt.events.JobDescriptionPosted;

			// End the auction later
			this.auctionEnd((this.data.biddingTime+30)*1000);

			return receipt.events.JobDescriptionPosted;

		}catch(error){
			console.error('posting job error', error);
			throw error;
		}
	}

	async auctionEnd(time){
		setTimeout(async function(job){
			try{
				let action = job.auctionContract.methods.auctionEnd(
					job.wallet.address,
					parseInt(job.jobID)
				);

				let receipt = await action.send({
					gas: await action.estimateGas()
				});

				this.transactions.push(receipt);

				return receipt;

			}catch(error){
				console.log('JobPoster auctionEnd error', error, 'job', job);
			}
		}, time, this);
	}

	async shareData(){
		try{

			let action = this.jobContract.methods.shareUntrainedModelAndTrainingDataset(
				this.id,
				this.data.files['jupyterNotebook'].magnetURI,
				this.data.files['trainingData'].magnetURI
			);

			let receipt = await action.send(
				{gas: await action.estimateGas()
			});

			this.transactions.push(receipt);

			return receipt;

		}catch(error){
			throw error;
		}
	}

	async shareTesting(){
		try{
			let action = this.jobContract.methods.shareTestingDataset(
				this.id,
				this.files.trainedModel.magnetURI,
				this.data.files.testingData.magnetURI
			);

			let receipt = await action.send({
				gas: await action.estimateGas()
			});

			this.transactions.push(receipt);

			return receipt;

		}catch(error){
			throw error;
		}
	}

	async payout(){
		try{
			let action = this.auctionContract.methods.payout(
				this.wallet.address,
				job.id
			);

			let receipt = await action.send({
				gas: await action.estimateGas()
			});

			this.transactions.push(receipt);

			return receipt;

		}catch(error){
			throw error;
		}
	}


	// Contract events
	async AuctionEnded(event){
		try{
			var results = event.returnValues;

			if(results.winner === '0x0000000000000000000000000000000000000000'){
				console.log('No one won...');
				let receipt =  await this.payout();
				console.log('payout receipt', receipt);
				return false;
			}

			await this.shareData();
			
		}catch(error){
			console.error('ERROR!!! `AuctionEnded`', error);
		}
	}

	async TrainedModelShared(event){
		try{
			this.files.trainedModel = {
				magnetURI: event.returnValues.trainedModelMagnetLink
			};

			await this.shareTesting();
		}catch(error){
			console.error('ERROR!!! `TrainedModelShared`', error);
		}
	}

	async JobApproved(event){
		try{
			let receipt = await this.payout();

			console.log('JobPoster JobApproved payout receipt', receipt);

		}catch(error){
			console.error('ERROR!!! `JobApproved`', error);
		}
	}
}

module.exports = {JobPoster};
