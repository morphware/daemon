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
		this.lastEvent = null;
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
				}
			}

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
				this.data.workerReward
			);

			this.transactions.push(transfer);
			
			// Seed files
			this.__parsePostFile(this.data);

			// Calculate the auction timing
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

			// Listen for events related to this job
			this.events();

			// Gather data about the job
			this.jobData = receipt.events.JobDescriptionPosted
			this.jobID = receipt.events.JobDescriptionPosted.returnValues.id

			// End the auction later
			this.auctionEnd((this.data.biddingTime+30)*1000);

			return receipt.events.JobDescriptionPosted;

		}catch(error){
			console.error('posting job error', error);
			throw error;
		}
	}


	// Contact actions
	async auctionEnd(time){
		setTimeout(async function(job){
			try{
				console.log('Inside JobPoster auctionEnd') // XXX
				let action = job.auctionContract.methods.auctionEnd(
					job.wallet.address,
					parseInt(job.jobID)
				);

				let receipt = await action.send({
					gas: await action.estimateGas()
				});

				console.log('JobPoster auctionEnd receipt', receipt)
			}catch(error){
				console.log('JobPoster auctionEnd error', error, 'job', job);
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
				this.jobID,
				this.files.trainedModel.magnetURI,
				this.data.files.testingData.magnetURI
			);

			return await action.send({
				gas: await action.estimateGas()
			});

		}catch(error){
			throw error;
		}
	}

	async payout(){
		try{
			console.log('Inside jodPosterpayout', this.jobID)
			let action = this.auctionContract.methods.payout(
				this.wallet.address,
				job.id
			)

			return await action.send({
				gas: await action.estimateGas()
			})

		}catch(error){
			throw error;
		}
	}

	// Listen events 
	events(){
		console.log('Listening for all events');

		let filter = {
			returnValues:{
				id: this.jobID
			}
		};

		this.auctionContract.events.allEvents(filter, (error, event)=>{
			try{
				console.info(`event ${event.event} from auctionContract.`);
				this.lastEvent = event.event;
				this.transactions.push(event);
				if(this[event.event]) this[event.event](parseEvent(event));
			}catch(error){
				console.error('job', this, 'event', event);
			}
		});

		this.jobContract.events.allEvents(filter, (error, event)=>{
			try{
				console.info(`event ${event.event} from jobContract.`);
				this.lastEvent = event.event;
				this.transactions.push(event);
				if(this[event.event]) this[event.event](parseEvent(event));
			}catch(error){
				console.error('job', this, 'event', event);
			}
		});
	}

	async AuctionEnded(event){
		try{
			console.log('Inside procAuctionEnded...', event); // XXX

			var results = event.returnValues;

			if(results.winner === '0x0000000000000000000000000000000000000000'){
				console.log('No one won...');
				let receipt =  await this.payout();
				console.log('payout receipt', receipt)
				return false;
			}

			await this.shareData();
			
		}catch(error){
			console.error('ERROR!!! `AuctionEnded`', error)
		}
	}

	async TrainedModelShared(event){
		try{
	        console.log('Inside JobPoster TrainedModelShared', this.jobID, event); // XXX

	        this.files.trainedModel = {
	        	magnetURI: event.returnValues.trainedModelMagnetLink
	        }

	        await this.shareTesting();
	    }catch(error){
	        console.error('ERROR!!! `TrainedModelShared`', error);
	    }
	}

	async JobApproved(event){
		try{
	        console.log('Inside JobPoster TrainedModelShared', this.jobID, event); // XXX

	        let receipt = await this.payout();

	        console.log('JobPoster JobApproved payout receipt', receipt);

	    }catch(error){
	        console.error('ERROR!!! `JobApproved`', error);
	    }
	}

}

// Helpers
function parseEvent(event){
	/*
	we want to get to the object that holds `returnValues`. Sometime its in the
	event, and sometimes there is next in a `evens` object.
	*/
	let name = event.event;
	if(event.events && event.events[name]){
		return event.events[name]
	}
	return event;
}

module.exports = {JobPoster};
