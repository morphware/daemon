'use static';

const {conf} = require('../conf');
const {web3} = require('./contract');

const jobFactoryAbi = require(`./../abi/${conf.jobFactoryAbiPath}`);
const auctionFactoryAbi = require(`./../abi/${conf.auctionFactoryABIPath}`);

// Hold the web3 contracts
const jobFactoryContract = new web3.eth.Contract(jobFactoryAbi, conf.jobFactoryContractAddress);
const auctionFactoryContract = new web3.eth.Contract(auctionFactoryAbi,conf.auctionFactoryContractAddress);


class Job{
	constructor(data){
		this.wallet = data.wallet;
		this.data = data;

		// Bind the passed wallet to the contracts
		this.jobContract = jobFactoryContract.clone();
		this.jobContract.options.from = this.wallet.address;

		this.auctionContract = auctionFactoryContract.clone();
		this.auctionContract.options.from = this.wallet.address;

		// Hold the relevant job data
		this.jobData = data.jobData || {};
		this.transactions = [];
	}

	get id(){
		return this.jobData.id;
	}

	// Jump table for jobs this client is currently apart of
	static jobs = {};

	// Listen for all events and call the correct instance 
	static events(){
		console.log('Listening for all contract events', this.name);

		auctionFactoryContract.events.allEvents((error, event)=>{
			try{

				console.info(this.name, `event ${event.event} from auctionContract.`);
				return this.__process_event(event);

			}catch(error){
				console.error(this.name, 'job', this, 'event', event);
			}
		});

		jobFactoryContract.events.allEvents((error, event)=>{
			try{

				console.info(this.name, `event ${event.event} from jobContract.`);
				return this.__process_event(event);

			}catch(error){
				console.error(this.name, 'error job', this, 'event', event, error);
			}
		});
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

		/*
		Some times its .id and sometimes its .auctionId...
		*/
		let id = event.returnValues.id || event.returnValues.auctionId

		console.log(`Look for an instance with job id ${id} for event ${name}`);

		if(!id){
			console.error('!!!!!!!!!!!! NO ID FOUND!!!!!!!!!!!!')
			console.error(event)
		}

		// Check to see if we are tracking the job tied to this event
		if(Object.keys(this.jobs).includes(id)){
			
			// Get the correct job instance from the job jump table
			let job = this.jobs[id];

			// Save this transaction to the instances job history
			job.transactions.push(event);

			// Call the relevant job method, if it exists
			if(job[name]) job[name](event);

			return;
		}

		// Do something with job events this client doesn't care about
		// Maybe stream them to the front end, idk.
	}
}

// Listen for job events
Job.events();

module.exports = {Job};
