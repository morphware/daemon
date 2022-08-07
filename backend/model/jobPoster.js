"use strict";

const { web3, percentHelper } = require("./contract");
const { conf } = require("../conf");
const { Job } = require("./job");
const webtorrent = require("../controller/torrent");
const fs = require("fs-extra");
const {
  runJupyterLabServer,
  stopJupyterLabServer,
} = require("../model/notebook");
const { wallet } = require("../model/morphware");
const { wait } = require("../helpers");

/*
JobPoster extends the common functions of Job class and is responsible for
handling functionality a poster node needs.

With out intimate knowledge of how this class functions, users should use
`JobPoster.new()` instead of `new JobPoster()` when making a new instance.

It is recommend you understand the Job class before editing the JobPoster class
*/

class JobPoster extends Job {
  constructor(wallet, postData) {
    // Note that JobPoster takes `postData` and NOT `jobData` as its
    // constructors second argument. We do not pass `jobData` to Job's
    // constructor because we do not have it yet.
    super(wallet);

    // Data for creating new job, this is the only Job type to have postData
    this.postData = postData;

    // Storing Magnet URI of trained models
    this.files = {};
  }

  // Build a hashable object to represent a current instance state.
  get asObject() {
    return {
      ...super.asObject,
      postData: this.postData,
    };
  }

  // Denote this instance as a poster type.
  get jobType() {
    return "poster";
  }

  /**
   * An 'in-transit' array which stores all jobs which have been posted but
   * have not yet had an event transmitted from the smart contract, signifiying the
   * job post has completed. Once that event is emmited, the job is moved from
   * preConfirmedJobs into Job.jobs using addToJump()
   */
  static preConfirmedJobs = [];

  /*
  Wrapper for creating a new job
  This only exists because a proper constructor can not be async and we
  have to wait for the job instanceId
  */
  static async new(wallet, postData) {
    try {
      // Start a new instance
      let job = new this(wallet, postData);
      console.log("Posting jobs");
      this.preConfirmedJobs.push(job);

      // Post the job
      await job.post();

      return job;
    } catch (error) {
      throw error;
    }
  }

  static async startNotebook() {
    try {
      await runJupyterLabServer();
    } catch (error) {
      console.error("ERROR!!! `Cannot open JupyterLab`", error);
    }
  }

  static async stopNotebook() {
    try {
      await stopJupyterLabServer();
    } catch (error) {
      console.error("ERROR!!! `Cannot stop JupyterLab`", error);
    }
  }

  static isMyPostedJob(name, event) {
    if (
      name === "JobDescriptionPosted" &&
      event.returnValues.jobPoster === wallet.address &&
      this.preConfirmedJobs.length > 0
    )
      return true;
    return false;
  }

  // Helpers
  async __parsePostFile(data) {
    /* parse the passed file paths from the passed instance data*/
    try {
      this.postData.files = {};
      let fileFields = ["jupyterNotebook", "trainingData", "testingData"];

      for (let field of fileFields) {
        let { magnetURI } = await webtorrent().findOrSeed(data[field]);
        this.postData.files[field] = {
          path: data[field],
          magnetURI: magnetURI,
        };
      }
    } catch (error) {
      console.log("error __parsePostFile", error);
      throw error;
    }
  }

  async __getFileSize(dataPath) {
    try {
      console.log("Checking size of ", dataPath);
      const stats = await fs.promises.stat(dataPath);
      return stats.size;
    } catch (error) {
      console.log("error __getFileSize", error);
      throw error;
    }
  }

  /*
  __process_event in the base Job class deals with listen for events on
  current job instances. In order for a worker to start the bidding process,
  we only care about `JobDescriptionPosted` if the client meets certainn run
  time states. We override __precess event below to make that happen.
  */
  static __process_event(name, instanceId, event) {
    try {
      //If JobDescriptionPosted for my job
      if (JobPoster.isMyPostedJob(name, event)) {
        let job = this.preConfirmedJobs.shift();
        job.__postJobDescription(event);
      }
    } catch (error) {
      console.error(`ERROR JobPoster __process_event`, error);
    }
  }

  /*
  Actions

  The client can initiate actions against the contract as a poster. Most of
  these result in a action being emitted to the smart contract.
  */

  // Create a new job
  async post() {
    try {
      console.log("Sending approve TX");
      // Approve funds for the contract to hold in escrow
      let reciept = await this.wallet.approve(
        conf.auctionFactoryContractAddress,
        this.postData.workerReward
      );
      console.log("Sent approve TX");

      console.log(reciept);

      await web3.eth.getTransactionReceiptMined(web3, reciept.transactionHash);

      console.log("Confirmed approve TX");

      // Hold the transaction for history
      this.transactions.push({ ...reciept, event: "approve" });

      // Seed files
      this.__parsePostFile(this.postData);

      console.log("Generated Magnet URI's");

      // Get Training Dataset file size
      let trainingDatasetSize = await this.__getFileSize(
        this.postData.trainingData
      );

      console.log("File size of training dataset: ", trainingDatasetSize);

      await wait();

      // Post the new job
      let action = this.jobContract.methods.postJobDescription(
        parseInt(this.postData.trainingTime),
        parseInt(trainingDatasetSize),
        parseInt(this.postData.errorRate),
        percentHelper(this.postData.workerReward, 10),
        this.postData.workerReward.toString(),
        1
      );

      await action.send({
        gas: await action.estimateGas(),
      });

      console.log("Sent postJobDescription TX");
    } catch (error) {
      console.error("posting job error", error);
      throw error;
    }
  }

  // The job posted will emit an event to end the auction, this will trigger
  // the smart contract to determine the wine and broadcast `AuctionEnded`
  async auctionEnd(seconds) {
    seconds += 180;
    console.log(
      "Calling auctionEnd in",
      seconds,
      "seconds, at",
      new Date(new Date().getTime() + seconds * 1000).toLocaleString()
    );

    setTimeout(
      async function (job) {
        try {
          console.info(
            "auctionEnd time up",
            job.instanceId,
            new Date().toLocaleString()
          );

          let action = job.auctionContract.methods.auctionEnd(
            job.wallet.address,
            parseInt(job.id)
          );

          let receipt = await action.send({
            gas: parseInt(parseInt(await action.estimateGas()) * 2),
          });

          job.transactions.push({ ...receipt, event: "auctionEnd" });

          return receipt;
        } catch (error) {
          console.log("JobPoster auctionEnd error", this.instanceId, error);
        }
      },
      seconds * 1000,
      this
    );
  }

  // Once we have determined a winner, we will share the code and model with
  // the winner worker.
  async shareData() {
    try {
      let action =
        this.jobContract.methods.shareUntrainedModelAndTrainingDataset(
          this.id,
          this.postData.files["jupyterNotebook"].magnetURI,
          this.postData.files["trainingData"].magnetURI
        );

      let receipt = await action.send({
        gas: parseInt(parseInt(await action.estimateGas()) * 2),
      });

      this.transactions.push({
        ...receipt,
        event: "shareUntrainedModelAndTrainingDataset",
      });

      return receipt;
    } catch (error) {
      throw error;
    }
  }

  // Once the winner worker is done processing the data, we will share the
  // testing data.
  async shareTesting() {
    console.log("🔥 poster sharing testing data");
    try {
      let action = this.jobContract.methods.shareTestingDataset(
        this.id,
        this.files.trainedModel.magnetURI,
        this.postData.files.testingData.magnetURI,
        this.postData.files.jupyterNotebook.magnetURI
      );

      let receipt = await action.send({
        gas: parseInt(parseInt(await action.estimateGas()) * 2),
      });

      this.transactions.push({ ...receipt, event: "shareTestingDataset" });

      return receipt;
    } catch (error) {
      throw error;
    }
  }

  // Regardless of how the auction ends, we need to call payout to get the
  // founds out of escrow.
  async payout() {
    try {
      let action = this.auctionContract.methods.payout(
        this.wallet.address,
        this.id
      );

      let receipt = await action.send({
        gas: parseInt(parseInt(await action.estimateGas()) * 1.101),
      });

      this.transactions.push({ ...receipt, event: "shareTestingDataset" });

      return receipt;
    } catch (error) {
      console.error("ERROR!!! JobPoster payout", error);
      throw error.message || "error";
    }
  }

  /*
  Events

  This sections maps events the clients listens for to actionable events.
  All of the following methods are intended to be called by the
  `Job.__processEvent` in the `Job` class. See the Events sections in the Job
  class for more information.
  */

  async BidPlaced(event) {
    console.info(
      "Bid placed",
      event.returnValues.bidder,
      this.instanceId,
      new Date().toLocaleString()
    );
  }

  async AuctionEnded(event) {
    try {
      this.jobData = { ...this.jobData, ...event.returnValues };

      // If the winner is you, the auction failed or no one bid
      if (this.jobData.winner === this.wallet.address) {
        console.log("No one won...");

        // Return the founds
        let receipt = await this.payout();

        // Drop this instance instance from the jump table
        this.removeFromJump();

        return false;
      }

      console.log(`${this.jobData.winner} won auction ${this.instanceId}`);

      await this.shareData();
    } catch (error) {
      console.error("ERROR!!! `AuctionEnded`", error);
    }
  }

  async TrainedModelShared(event) {
    try {
      console.log("TrainedModelShared Event: ", event);

      this.files.trainedModel = {
        magnetURI: event.returnValues.trainedModelMagnetLink,
      };

      await this.shareTesting();
    } catch (error) {
      console.error("ERROR!!! `TrainedModelShared`", error);
    }
  }

  async JobApproved() {
    try {
      let receipt = await this.payout();
      console.log("JobPoster JobApproved payout receipt", receipt);

      this.downloadPath = `${conf.appDownloadPath}${this.jobData.jobPoster}/${this.id}`;
      console.log("Download Path: ", this.downloadPath);

      // Make sure download spot exists
      fs.ensureDirSync(this.downloadPath);

      // Download the shared files
      let downloads = await webtorrent().downloadAll(
        this.downloadPath,
        this.files.trainedModel.magnetURI
      );

      console.log("Download Complete: ", downloads);

      let path = downloads[0].path || "path?";

      console.log("Trained Model Path: ", path);
    } catch (error) {
      console.error("ERROR!!! `JobApproved`", error);
    }
  }

  async __postJobDescription(event) {
    this.transactions.push({ event: "postJobDescription" });

    // Gather data about the job
    this.jobData = event.returnValues;

    // Hold the this job in the jump table
    this.addToJump();

    let now = new Date().getTime();
    let biddingDeadline = event.returnValues.biddingDeadline * 1000;
    let revealDeadline = event.returnValues.revealDeadline * 1000;
    let auctionEnd = revealDeadline - now;

    console.info(
      "Started auction",
      this.instanceId,
      new Date().toLocaleString()
    );
    console.info(
      "Started auction biddingDeadline",
      this.instanceId,
      new Date(biddingDeadline).toLocaleString()
    );
    console.info(
      "Started auction revealDeadline",
      this.instanceId,
      new Date(revealDeadline).toLocaleString()
    );

    // End the auction when the reveal deadline has passed
    this.auctionEnd(parseInt(auctionEnd) / 1000);
  }
}

/*
Listen for `JobPostedDescription` events. This runs in addition to `Job.events`
*/
if (conf.role === "Poster") {
  console.log("Listening as poster");
  JobPoster.events();
}

module.exports = { JobPoster };
