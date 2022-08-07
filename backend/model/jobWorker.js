"use strict";

const {
  fileExtensionExtractor,
  filenameExtractor,
} = require("./../utils/files");
const fs = require("fs-extra");
const crypto = require("crypto");
const checkDiskSpace = require("check-disk-space").default;
const { spawn } = require("child_process");
const { conf } = require("../conf");
const webtorrent = require("../controller/torrent");
const { web3 } = require("./contract");
const { wallet } = require("./morphware");
const { Job } = require("./job");
const { exec } = require("./python");
const {
  installNotebookDependencies,
  updateNotebookMorphwareTerms,
} = require("./notebook");
const { calculateBid } = require("../pricingUtils");
const { wait } = require("../helpers");
const { execWithPromise } = require("../utils/shellUtils");
const path = require("path");

/*
JobWorker extends the common functions of Job class and is responsible for
handling functionality a worker node needs.

Instances of this class are created based on the `JobDescriptionPosted` event.
See `__process_event` below for more information

This module starts JobWorker.events() at the end if this file so this classes
`__process_event` is called.

It is recommend you understand the Job class before editing the JobWorker class
*/

class JobWorker extends Job {
  constructor(wallet, jobData) {
    super(wallet, jobData);
  }

  // Denote this instance as a Worker type.
  get jobType() {
    return "worker";
  }

  /*
  this.lock will determine if this client is currently occupied with another
  another job. We will over ride `addTOJump` and `removeFromJump` to set
  locking at the correct times.
  */

  static lock = false;

  /*
    A worker can choose to mine if they are not currently working on a job.
    this.childMiner holds the child process if the worker is currently mining
  */

  static childMiner;

  addToJump() {
    super.addToJump();
    this.constructor.lock = true;
  }

  removeFromJump() {
    try {
      super.removeFromJump();
      this.constructor.lock = false;
    } catch (error) {}
  }

  // Check to see if the client is ready and willing to take on jobs
  static canTakeWork() {
    return conf.role === "Worker" && !this.lock && this.canTrainOrValidate();
  }

  static async startMining() {
    try {
      // If in development mode, just run the NSFMiner
      const pool = `stratum://${wallet.address}.morphware-worker-node@us-eth.2miners.com:2020`;
      let pathToMiner;
      if (conf.environment === "development") {
        pathToMiner = await execWithPromise("pwd");
        pathToMiner = pathToMiner.replace(
          "/backend\n",
          "/extraResources/nsfminer"
        );
      } else {
        pathToMiner = path.join(
          process.resourcesPath,
          "extraResources",
          "nsfminer"
        );
      }

      const miningCommand = `${pathToMiner} --pool ${pool} --api-port 3654`;

      console.log("Running");
      console.log(miningCommand);

      const miner = spawn(miningCommand, {
        shell: true,
        stdio: ["inherit", "inherit", "inherit"],
        detached: false,
      });

      miner.on("close", (code, signal) => {
        console.log(
          `child process terminated due to receipt of signal ${signal}`
        );
      });

      miner.on("exit", (code, signal) => {
        console.log(`child process exited due to receipt of signal ${signal}`);
      });

      miner.on("error", (code, signal) => {
        console.log(`child process errored due to receipt of signal ${signal}`);
      });

      this.childMiner = miner;

      return miningCommand;
    } catch (error) {
      console.log("Error in startMining: ", error);
      throw error;
    }
  }

  static async stopMining() {
    try {
      if (!this.childMiner || !this.childMiner.pid) {
        throw "Miner is not running";
      }

      // BAD WAY TO KILL. FIX
      const pidToKil = parseInt(this.childMiner.pid) + 1;
      await execWithPromise(`kill ${pidToKil}`);

      this.childMiner = null;
    } catch (error) {
      console.log("Error in stopMining: ", error);
      throw error;
    }
  }

  static async getMiningStats() {
    try {
      if (!this.childMiner || !this.childMiner.pid) {
        throw "Miner is not running";
      }

      const stats = await execWithPromise(
        `echo '{"id":1,"jsonrpc":"2.0","method":"miner_getstat1"}' | nc localhost 3654 -N`
      );
      return stats;
    } catch (error) {
      console.log("Error in stopMining: ", error);
      // throw error;
      return {};
    }
  }

  static isMining() {
    return !!this.childMiner;
  }

  /*
  __process_event in the base Job class deals with listen for events on
  current job instances. In order for a worker to start the bidding process,
  we only care about `JobDescriptionPosted` if the client meets certainn run
  time states. We override __precess event below to make that happen.
  */
  static __process_event(name, instanceId, event) {
    try {
      // If tracking this job and its been approved
      if (
        name === "JobApproved" &&
        Object.keys(Job.jobs).includes(instanceId)
      ) {
        const completedJob = Job.jobs[instanceId];
        completedJob.__JobApproved(event);
      }

      // Check to see if job is already tracked by this client
      if (Object.keys(Job.jobs).includes(instanceId)) return;

      if (name === "JobDescriptionPosted") {
        // Check to see if this client is accepting work or attempting to work on its own posted job
        if (
          !this.canTakeWork() ||
          event.returnValues.jobPoster === wallet.address
        )
          return;

        // Make the job instance
        let job = new this(wallet, event.returnValues);

        // Display for auction times
        console.log("New job found!", new Date().toLocaleString());
        console.info(
          "biddingDeadline",
          job.instanceId,
          new Date(
            parseInt(job.jobData.biddingDeadline * 1000)
          ).toLocaleString()
        );
        console.info(
          "revealDeadline",
          job.instanceId,
          new Date(parseInt(job.jobData.revealDeadline * 1000)).toLocaleString()
        );

        job.addToJump();
        job.transactions.push(event);
        job.__JobDescriptionPosted(event);
      }
    } catch (error) {
      this.removeFromJump();
      console.error(`ERROR JobWorker __process_event`, error);
    }
  }

  // Helpers
  async __checkDisk(size, target) {
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

  async bid() {
    try {
      console.info("Bidding on", this.instanceId, new Date().toLocaleString());

      const biddingAmount = await calculateBid(
        this.jobData.estimatedTrainingTime,
        await wallet.MWTUSDPrice()
      );

      console.log("BiddingAmount: ", biddingAmount);

      let reciept = await this.wallet.approve(
        conf.auctionFactoryContractAddress,
        biddingAmount
      );

      await web3.eth.getTransactionReceiptMined(web3, reciept.transactionHash);

      console.log("Confirmed pre-post MWT approval");

      await wait();

      this.bidData = {
        bidAmount: biddingAmount,
        fakeBid: false,
        secret: `0x${crypto.randomBytes(32).toString("hex")}`,
      };

      console.log("bidding data", this.bidData, this.instanceId);

      let action = this.auctionContract.methods.bid(
        this.jobData.jobPoster,
        parseInt(this.id),
        web3.utils.keccak256(
          web3.utils.encodePacked(
            this.bidData.bidAmount,
            this.bidData.fakeBid,
            this.bidData.secret
          )
        ),
        biddingAmount
      );

      let receipt = await action.send({
        gas: parseInt(parseInt(await action.estimateGas()) * 2),
      });

      this.transactions.push({ ...receipt, event: "bid" });

      return receipt;
    } catch (error) {
      this.removeFromJump();
      console.log(`ERROR!!! JobWorker bid`, this.instanceId, error);
      throw "error";
    }
  }

  async reveal() {
    try {
      console.info(
        "Revealing now on",
        this.instanceId,
        new Date().toLocaleString()
      );

      let action = this.auctionContract.methods.reveal(
        this.jobData.jobPoster,
        parseInt(this.id),
        this.bidData.bidAmount,
        this.bidData.fakeBid,
        this.bidData.secret
      );

      let receipt = await action.send({
        gas: parseInt(parseInt(await action.estimateGas()) * 2),
      });

      this.transactions.push({ ...receipt, event: "reveal" });

      return receipt;
    } catch (error) {
      this.removeFromJump();
      console.error("ERROR!!! JobWorker reveal", this.instanceId, error);
    }
  }

  async shareTrainedModel() {
    console.log("Sharing Trained Model");

    console.log("TRAINED MODEL PATH: ", this.trainedModelPath);

    let { magnetURI } = await webtorrent().findOrSeed(this.trainedModelPath);

    console.log("Magnet Link to trained mode: ", magnetURI);

    // let action = this.jobFactoryContract.methods.shareTrainedModel(
    let action = this.jobContract.methods.shareTrainedModel(
      this.jobData.jobPoster,
      parseInt(this.id),
      magnetURI, // get this data
      // parseInt(trainingErrorRate) // get this data\
      6 //is 0.06 a uint64
    );

    console.log("Action: ", action);

    let receipt = await action.send({
      gas: await action.estimateGas(),
    });

    console.log("Reciept: ", receipt);

    this.transactions.push({ ...receipt, event: "shareTrainedModel" });
    // this.transactions.push({...receipt, event:'postJobDescription'});

    return receipt;
  }

  async withdraw() {
    try {
      console.info(
        "Withdrawing on",
        this.instanceId,
        new Date().toLocaleString()
      );

      let action = this.auctionContract.methods.withdraw();

      let receipt = await action.send({
        gas: parseInt(parseInt(await action.estimateGas()) * 1.101),
      });

      this.transactions.push({ ...receipt, event: "withdraw" });

      return receipt;
    } catch (error) {
      this.removeFromJump();
      console.error("ERROR JobWorker withdraw", error);
    }
  }

  /*
  Events

  This sections maps events the clients listens for to actionable events.
  All of the following methods are intended to be called by the
  `Job.__processEvent` in the `Job` class. See the Events sections in the Job
  class for more information.
  */

  async __JobDescriptionPosted(event) {
    // This is prefixed with '__' so its not auto called by Job.events and
    // ONLY called when this class wants to call it.

    try {
      // Confirm we have enough free space to perform the job
      /*			if(!await this.__checkDisk(this.trainingDatasetSize, conf.appDownloadPath)){
        console.info('Not enough free disk space, passing');

        // Drop this instance instance from the jump table
        this.removeFromJump();

        return false;
      }*/

      var now = new Date().getTime();
      var revealDeadline = parseInt(this.jobData.revealDeadline);

      //Reveal 4 minutes before reveal deadline
      var revealTime = revealDeadline * 1000 - 4 * 60 * 1000;
      var revealInMS = revealTime - now;

      var revealDeadline = new Date(revealTime).toLocaleTimeString();

      console.log("\n\n\n\nthis.jobData:", this.jobData);
      console.log(
        "Revealing bid in",
        revealInMS / 1000,
        " at ",
        revealDeadline
      );
      console.log(
        "Reveal Deadline from smartContract: ",
        parseInt(this.jobData.revealDeadline)
      );

      await this.bid();

      // reveal the bid during the reveal window
      setTimeout(() => {
        this.reveal();
      }, revealInMS);
    } catch (error) {
      this.removeFromJump();
      console.error(`ERROR!!! JobWorker __JobDescriptionPosted`, error);
    }
  }

  async AuctionEnded(event) {
    try {
      this.jobData = { ...this.jobData, ...event.returnValues };

      if (this.jobData.winner === this.wallet.address) {
        console.info("We won!", this.instanceId);

        // If we do win, we will continue to act on events for this
        // instanceID and wait for the poster to fire the next step.

        //Stop mining if you are
        if (this.childMiner) {
          JobWorker.stopMining();
        }
      } else {
        console.log("We lost...", this.instanceId);

        // Drop this instance instance from the jump table
        this.removeFromJump();

        // Return your bid escrow
        await this.withdraw();
      }
    } catch (error) {
      this.removeFromJump();
      console.error("ERROR!!! `AuctionEnded`", error);
    }
  }

  async UntrainedModelAndTrainingDatasetShared(event) {
    try {
      this.downloadPath = `${conf.appDownloadPath}${this.jobData.jobPoster}/${this.id}`;

      // Make sure download spot exists
      fs.ensureDirSync(this.downloadPath);

      // Download the shared files
      let downloads = await webtorrent().downloadAll(
        this.downloadPath,
        event.returnValues.untrainedModelMagnetLink,
        event.returnValues.trainingDatasetMagnetLink
      );

      console.log("Downloads", downloads);

      console.info(
        "Download done!",
        this.instanceId,
        new Date().toLocaleString()
      );

      let jupyterNotebookPathname;
      let trainingDataPathname;
      let pythonPathname;

      for (let download of downloads) {
        if (fileExtensionExtractor(download.dn) == "ipynb") {
          jupyterNotebookPathname = download.path + "/" + download.dn;
          //Convert .ipynb => .py
          await exec("jupyter nbconvert --to script", jupyterNotebookPathname);
          pythonPathname =
            download.path + "/" + filenameExtractor(download.dn) + ".py";
        } else if (fileExtensionExtractor(download.dn) == "py") {
          pythonPathname = download.path + "/" + download.dn;
        } else {
          //TODO: Unzip if needed
          trainingDataPathname = download.path + "/" + download.dn;
        }
      }

      console.log("pythonPathname:", pythonPathname);

      await installNotebookDependencies(pythonPathname);

      await updateNotebookMorphwareTerms(
        pythonPathname,
        this.downloadPath + "/"
      );

      await exec("python3", pythonPathname, "morphware_train");

      this.trainedModelPath = this.downloadPath + "/" + "trained_model.pkl";

      this.shareTrainedModel();

      JobWorker.startMining();
    } catch (error) {
      this.removeFromJump();
      console.error(
        "ERROR!!! JobWorker UntrainedModelAndTrainingDatasetShared",
        this.instanceId,
        error
      );
    }
  }

  async __JobApproved() {
    try {
      console.log("this: ", this);
      console.log(this.downloadPath);
      fs.emptyDirSync(this.downloadPath);
      fs.rmdirSync(this.downloadPath);
    } catch (error) {
      console.error("ERROR!!! JobWorker __JobApproved", this.instanceId, error);
    }
  }
}

/*
Listen for `JobPostedDescription` events. This runs in addition to `Job.events`
*/
if (conf.role === "Worker") {
  JobWorker.events();
}

module.exports = { JobWorker };
