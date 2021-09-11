'use strict';

const path = require('path');
const conf = require('../conf');
const {web3} = require('./contract');
const webtorrent = require('../controller/torrent');

let jobFactoryAbi = require(path.resolve(conf.jobFactoryAbiPath));
let jobFactoryContract = new web3.eth.Contract(jobFactoryAbi, conf.jobFactoryContractAddress);

var auctionFactoryAbi = require(path.resolve(conf.auctionFactoryABIPath));
var auctionFactoryContract = new web3.eth.Contract(auctionFactoryAbi,conf.auctionFactoryContractAddress);



class JobPoster{


	constructor(data){
		this.wallet = data.wallet;

		this.data = data;

		this.jobContract = jobFactoryContract.clone();
		this.jobContract.options.from = this.wallet.address;
		this.auctionContract = auctionFactoryContract.clone();
		this.auctionContract.options.from = this.wallet.address;


		this.jobID = null;
		this.jobData = {};
		this.transactions = [];
	}
	static jobs = {}

	static async new(data){
		try{
			let job = new JobPoster(data)

			let jobData = await job.post();

			JobPoster.jobs[jobData.returnValues.id] = job;

			return job;
		}catch(error){
			throw error;
		}

	}

	async __parsePostFile(data){
		try{

			let files = {};
			let fileFields = [
				'jupyterNotebook',
				'trainingData',
				'testingData'
			]

			for(let field of fileFields){
				let {magnetURI} = await seedFile(data[field]);
				files[field] = {
					path: data[field],
					magnetURI: magnetURI
				}
			}

			return files
		}catch(error){
			console.log(' error __parsePostFile', error)
			throw error;
		}
	}

	async post(){
		try{

			// Transfer founds for the contract to hold in escrow
			let transfer = await this.wallet.send(
				conf.auctionFactoryContractAddress,
				web3.utils.toWei(this.data.workerReward.toString())
			);

			this.transactions.push(transfer);
			this.data.files = await this.__parsePostFile(this.data);

			// Calculate the auction timing
			var biddingDeadline = Math.floor(new Date().getTime() / 1000) + parseInt(this.data.biddingTime)
			var revealDeadline = biddingDeadline+30  // TODO Replace this

			// Post the new job
			let action = this.jobContract.methods.postJobDescription(
				parseInt(this.data.trainingTime),
				parseInt(32000), // get size this.data['training-data']
				parseInt(this.data.errorRate),
				parseInt(Number(this.data.workerReward)*.1),
				biddingDeadline,
				revealDeadline,
				web3.utils.toWei(this.data.workerReward.toString())
			);

			let receipt = await action.send({
				gas: await action.estimateGas()
			});

			console.log('jobPosted receipt', receipt)

			// Gather data about the job
			this.transactions.push(receipt)
			this.jobData = receipt.events.JobDescriptionPosted
			this.jobID = receipt.events.JobDescriptionPosted.returnValues.id

			this.auctionEnd((this.data.biddingTime+5)*1000);

			return receipt.events.JobDescriptionPosted;

		}catch(error){
			console.error('posting job error', error);
			throw error;
		}
	}

	async auctionEnd(time){
		setTimeout(async function(job){
			try{
				console.log('About to call auctionEnd()') // XXX
				let action = job.auctionContract.methods.auctionEnd(
					job.wallet.address,
					parseInt(job.jobID)
				);

				let receipt = await action.send({
					gas: await action.estimateGas()
				});

				console.log('auctionEnd', receipt)
			}catch(error){
				console.log('auctionEnd error', error);
			}
		}, time, this);
	}

	async shareData(){
		try{

			let action = this.jobContract.methods.shareUntrainedModelAndTrainingDataset(
				this.jobID,
				this.data.files['jupyterNotebook'].magnetURI,
				this.data.files['trainingData'].magnetURI
			);

			return await action.send(
				{gas: await action.estimateGas()
			});

		}catch(error){
			throw error;
		}
	}

	async shareTesting(){
		try{

			let action = this.jobContract.methods.shareTestingDataset(
				job.id,
				job.trainedModelMagnetLink,
				this.data.files['testing-data'].magnetURI
			);

			return await action.send({
				gas: await action.estimateGas()
			});

		}catch(error){
			throw error;
		}
	}

	async payOut(){
		try{

			let action = this.auctionContract.methods.payout(
				wallet.address,
				job.id
			)

			return await action.send({
				gas: await action.estimateGas()
			})

		}catch(error){
			throw error;
		}
	}

	events(){
		auctionFactory.events.AuctionEnded({
		    filter: {
		        endUser: wallet.address 
		    }
		}, function(error, event){
			console.log('event ')
		});
	}
}


function seedFile(file){
	return new Promise(function(resolve, reject){
		webtorrent.seed(file, function(torrent){
			resolve(torrent); // magnetURI
		});
	});
}

module.exports = {JobPoster};
