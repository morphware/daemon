"use strict";
const {
  fileExtensionExtractor,
  filenameExtractor,
} = require("./../utils/files");
const fs = require("fs-extra");
const checkDiskSpace = require("check-disk-space").default;

const { conf } = require("../conf");
const webtorrent = require("../controller/torrent");
const { wallet } = require("./morphware");
const { Job } = require("./job");
const { exec } = require("./python");
const {
  installNotebookDependencies,
  updateNotebookMorphwareTerms,
} = require("./notebook");

/*
JobValidator extends the common functions of Job class and is responsible for
handling functionality a validator node needs.

Instances of this class are created based on the `JobDescriptionPosted` event.
See `__process_event` below for more information

This module starts JobValidator.events() at the end if this file so this classes
`__process_event` is called.

It is recommend you understand the Job class before editing the JobValidator class
*/

class JobValidator extends Job {
  constructor(wallet, jobData) {
    super(wallet, jobData);
  }

  // Denote this instance as a Validator type.
  get jobType() {
    return "validator";
  }

  /*
  this.lock will determine if this client is currently occupied with another
  another job. We will over ride `addTOJump` and `removeFromJump` to set
  locking at the correct times.
  */

  static lock = false;

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
  static canValidate(name, instanceId) {
    const jobNumber = parseInt(instanceId.split(":")[1]);
    const shouldValidate =
      jobNumber % conf.validationNodes === conf.validatorId;
    return (
      name === "TestingDatasetShared" &&
      conf.role === "Validator" &&
      !this.lock &&
      shouldValidate &&
      this.canTrainOrValidate()
    );
  }

  /*
  __process_event in the base Job class deals with listen for events on
  current job instances. In order for a validator to start the bidding process,
  we only care about `JobDescriptionPosted` if the client meets cretin run
  time states. We override __precess event below to make that happen.
  */
  static __process_event(name, instanceId, event) {
    try {
      // Check to see if job is already tracked by this client
      if (Object.keys(Job.jobs).includes(instanceId)) return;

      if (JobValidator.canValidate(name, instanceId)) {
        let job = new this(wallet, event.returnValues);
        job.__TestingDatasetShared(event);
      }
    } catch (error) {
      console.error(`ERROR JobValidator __process_event`, error);
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

  The client can initiate actions against the contract as a validator. Most of
  these result in a action being emitted to the smart contract.
  */

  async downloadAndTestModel(event) {
    try {
      let job = event.returnValues;

      this.downloadPath = `${conf.appDownloadPath}${this.jobData.jobPoster}/${this.id}`;

      console.log("download path:");
      console.log(this.downloadPath);

      // Make sure download spot exists
      fs.ensureDirSync(this.downloadPath);

      // Download the shared files
      let downloads = await webtorrent().downloadAll(
        this.downloadPath,
        event.returnValues.trainedModelMagnetLink,
        event.returnValues.testingDatasetMagnetLink,
        event.returnValues.untrainedModelMagnetLink
      );

      console.log("Downloads", downloads);

      console.info(
        "Download done!",
        this.instanceId,
        new Date().toLocaleString()
      );

      let jupyterNotebookPathname;
      let testingDataPathname;
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
          testingDataPathname = download.path + "/" + download.dn;
        }
      }

      console.log("pythonPathname:", pythonPathname);

      await installNotebookDependencies(pythonPathname);

      await updateNotebookMorphwareTerms(
        pythonPathname,
        this.downloadPath + "/"
      );

      const std = await exec("python3", pythonPathname, "morphware_validate");

      console.log("Python STD: ", std);
      console.log("Python STDOUT: ", std.out);

      const accuracy = parseInt(parseFloat(std.out[0]) * 100);

      const minAllowableAccuracyRate = parseInt(
        event.returnValues.targetErrorRate // TODO change to targetAccuracyRate
      );

      console.log("Training Accuracy: ", accuracy);
      console.log("Required Min Accuracy: ", minAllowableAccuracyRate);

      if (accuracy >= minAllowableAccuracyRate) {
        //Approve the job if loss is less than target loss
        let action = this.jobContract.methods.approveJob(
          job.jobPoster,
          parseInt(job.id),
          job.trainedModelMagnetLink
        );

        let receipt = await action.send({
          gas: await action.estimateGas(),
        });
      } else {
        throw `This model isn't accurate enough. Accuracy is ${accuracy} minAllowableAccuracyRate is ${minAllowableAccuracyRate}`;
      }
    } catch (error) {
      // this.removeFromJump();
      console.error(`ERROR!!! JobValidator __JobDescriptionPosted`, error);
    }
  }

  /*
  Events

  This sections maps events the clients listens for to actionable events.
  All of the following methods are intended to be called by the
  `Job.__processEvent` in the `Job` class. See the Events sections in the Job
  class for more information.
  */

  async __TestingDatasetShared(event) {
    try {
      // Display for auction times
      console.log("New Validation job found", new Date().toLocaleString());

      this.addToJump();
      this.transactions.push(event);
      this.downloadAndTestModel(event);
    } catch (error) {
      // this.removeFromJump();
      console.error(`ERROR!!! JobValidator __JobDescriptionPosted`, error);
    }
  }
}

/*
Listen for `JobPostedDescription` events. This runs in addition to `Job.events`
*/
if (conf.role === "Validator") {
  JobValidator.events();
}

module.exports = { JobValidator };
