"use static";

const { conf } = require("../conf");
const { web3 } = require("./contract");
const { wait } = require("../helpers");

const jobFactoryAbi = require(`./../abi/${conf.jobFactoryAbiPath}`);
const auctionFactoryAbi = require(`./../abi/${conf.auctionFactoryABIPath}`);

// Hold the web3 contracts
const jobFactoryContract = new web3.eth.Contract(
  jobFactoryAbi,
  conf.jobFactoryContractAddress
);
const auctionFactoryContract = new web3.eth.Contract(
  auctionFactoryAbi,
  conf.auctionFactoryContractAddress
);

/*
Job is the base class to implement common function job nodes need. It is not
suppose to be used on its own and should all ways be used to extend a
specialized job class. Job.events(), called at the bottom of this file, is an
exception.
*/

class Job {
  constructor(wallet, jobData) {
    // All jobs need a wallet bound to interact with contracts and
    // transfer founds.
    if (!wallet) throw "Can not create Job with out wallet";
    this.wallet = wallet;

    // The data returned by the start contract on jobPosted. All job typed
    // will have this.
    this.jobData = jobData || {};

    // History of actions performed for this job.
    this.transactions = [];

    // Bind the passed wallet to the contracts.
    this.jobContract = jobFactoryContract.clone();
    this.jobContract.options.from = this.wallet.address;

    this.auctionContract = auctionFactoryContract.clone();
    this.auctionContract.options.from = this.wallet.address;
  }

  // Build a hashable object to represent a current instance state.
  get asObject() {
    return {
      id: this.id,
      instanceId: this.instanceId,
      wallet: this.wallet.address,
      type: this.jobType,
      status: this.status,
      transactions: this.transactions,
      jobData: this.jobData,
    };
  }

  get status() {
    return this.transactions.map((event) => event.event).slice(-1)[0];
  }

  /*
	Helpers

	A job/auction ID is not globally unique. Each poster address gets an
	incremented id, starting at zero. Because of this, we need to track both
	the job/auction ID and make out own globally unique ID, instanceID 
	*/

  // Id of the auction
  get id() {
    return this.jobData.id;
  }

  // Globally unique id to track instances
  get instanceId() {
    return `${this.jobData.jobPoster}:${this.jobData.id}`;
  }

  /*
	The job jump table, `Jobs.jobs` holds instances this client is current
	working with. It allows matching of incoming events to instances. Once the
	client is done with a job, for any reason, its removed from the jump table.
	Mapping is `instanceID` => Job instance
	*/

  static jobs = {};

  addToJump() {
    this.constructor.jobs[this.instanceId] = this;
  }

  removeFromJump() {
    delete this.constructor.jobs[this.instanceId];
  }

  /*
	Jobs stream

	Hold `streamMaxLength` amount of job events to report to the user so they
	can see whats going on in the network.
	*/

  static streamMaxLength = 50;

  static stream = [];

  static streamAdd(event) {
    this.stream.push(event);

    if (this.stream.length > this.streamMaxLength) this.stream.shift();
  }

  /*
	Events

	We will listen for all incoming requests for the job and auction contract. 
	Parse the instanceID, event name and events returnValues out. Using the
	instanceID we will check the jump table to see if this client is working
	with the job associated with the incoming event. If we have a match, we grab
	the correct instance from the jump table call the instanced method for the
	incoming event
	*/

  static events() {
    auctionFactoryContract.events.allEvents((error, event) => {
      try {
        return this.__parse_event(event);
      } catch (error) {
        console.error(this.name, "job", this, "event", event);
      }
    });

    jobFactoryContract.events.allEvents((error, event) => {
      try {
        return this.__parse_event(event);
      } catch (error) {
        console.error(this.name, "error job", this, "event", event, error);
      }
    });
  }

  // Helper function to extract common data from incoming events
  static __parse_event(event) {
    let name = event.event;

    /*
		we want to get to the object that holds `returnValues`. Sometime its in the
		event, and sometimes there is returnValue in a `events` object.
		*/
    if (event.events && event.events[name]) {
      event = event.events[name];
    }

    /*
		Some times its .id and sometimes its .auctionId...
		*/
    let id = event.returnValues.id || event.returnValues.auctionId;

    // Now that we have the ID, we can figure out the instanceID
    let instanceId = `${event.returnValues[0]}:${id}`;

    // Do something useful with the parsed data
    this.__process_event(name, instanceId, event);
  }

  // Perform logic for the incoming events, This is meant to overridden in
  // when an event is required to kick off the creation of a new local
  // instance.
  static async __process_event(name, instanceId, event) {
    // Check to see if we are tracking the job tied to this event
    if (Object.keys(this.jobs).includes(instanceId)) {
      // Get the correct job instance from the job jump table
      let job = this.jobs[instanceId];

      await wait();

      // Call the relevant job method, if it exists
      if (job[name]) {
        job[name](event);

        // Add this transaction event to the transaction history
        job.transactions.push(event);
      }

      return;
    }

    // Capture event in the events stream
    this.streamAdd(event);
  }
}

/*
When this module is loaded we will start listen for events emitted from the
smart contract.
*/
Job.events();

module.exports = { Job };
