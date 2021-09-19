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
			if(conf.acceptWork){
				// Make new job instance
				let job = new this({jobData: event.returnValue});
				Job.jobs[job.id] = job;
				job.transactions.push(event);
				let jobData = await job.JobDescriptionPosted();
			}

		}catch(error){
			throw error;
		}
	}

	// Contract actions
	async bid(){

		this.bid = {
			bidAmount: 11 // How do we figure out the correct bid?
			fakeBid: false // How do we know when to fake bid?
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
			job.jobPoster,
			parseInt(job.id),
			[bidAmount],
			[fakeBid],
			[secret]
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

}


// Inject
Job.workerCreator = JobWorker.new

module.exports = {JobWorker};
