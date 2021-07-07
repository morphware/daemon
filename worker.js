#!/usr/bin/env node

const fs   = require('fs');
const path = require('path');
const Web3 = require('web3');
const disk = require('diskusage');


var provider = new Web3.providers.WebsocketProvider('ws://localhost:8545');
var web3 = new Web3(provider);

var workerAddress = '0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0';

var jobFactoryContractAddress = '0xC89Ce4735882C9F0f0FE26686c53074E09B0D550';
var jobFactoryABIPathname = './abi/JobFactory-copyABI.json';
var jobFactoryAbi = JSON.parse(fs.readFileSync(path.resolve(jobFactoryABIPathname),'utf-8')).abi;
var jobFactoryContract = new web3.eth.Contract(jobFactoryAbi,jobFactoryContractAddress);

var minHourlyRate = 5; // TODO Compare this to cost of running on a cloud, as an upper bound, and mining a crypto, as a lower bound

var auctionFactoryABIPathname = './abi/VickreyAuction-copyABI.json';
var auctionFactoryAbi = JSON.parse(fs.readFileSync(path.resolve(auctionFactoryABIPathname),'utf-8')).abi;

/*
TODO Listen for job-posting events emitted by the smart contracts:
     - JobFactory
         1. JobDescriptionPosted
         3. UntrainedModelAndTrainingDatasetShared
         4. TrainedModelShared
         5. JobApproved
     - AuctionFactory
         2. AuctionEnded
*/

(async function procJobDescriptionPosted(){
    // (A) This should listen for an event,
    //     if it is not working on a job right now,
    //     or if GPU utilization is not too high.
    //
    //     For the sake of simplicity, this is assumed to be true.
    try {
        console.log('\nWorker node listening for JobDescriptionPosted from JobFactory...') // XXX

        // jobFactoryContract.once('JobDescriptionPosted', async function(error, event) {
        await jobFactoryContract.events.JobDescriptionPosted(
            async function(error, event) {

                // let event = await jobFactoryContract.events.JobDescriptionPosted()
                var job = event.returnValues;

                var maxDiskSpace;
                disk.check('/', function(err, sysinfo) {
                    maxDiskSpace = sysinfo.free;
                });

                if (parseInt(job.trainingDatasetSize) <= maxDiskSpace) {
                    if ((parseInt(job.workerReward) / (parseInt(job.estimatedTrainingTime) / 60)) >= minHourlyRate) {

                        var auctionFactory = new web3.eth.Contract(auctionFactoryAbi,job.auctionAddress);

                        var bidAmount = 11;
                        var fakeBid = false;
                        var secret = '0x6d6168616d000000000000000000000000000000000000000000000000000000';


                        await auctionFactory.methods.bid(
                            job.jobPoster,
                            parseInt(job.id),
                            web3.utils.keccak256(web3.utils.encodePacked(bidAmount,fakeBid,secret)),
                            bidAmount
                        ).send(
                            {from:workerAddress, gas:'3000000'}
                        ).on('receipt', async function(receipt) {
                            console.log('\nBid sent'); // XXX
                            console.log(receipt); // XXX

                            var currentTimestamp = Math.floor(new Date().getTime() / 1000);
                            console.log('\ncurrentTimestamp:',currentTimestamp); // XXX

                            var auction = await auctionFactory.methods.auctions(job.jobPoster,parseInt(job.id)).call();

                            var biddingDeadline = parseInt(auction.biddingDeadline);
                            console.log('\nbiddingDeadline:',biddingDeadline); // XXX

                            var revealDeadline = parseInt(auction.revealDeadline);
                            console.log('revealDeadline:',revealDeadline); // XXX


                            var safeDelay = 5;
                            var waitTimeInMS1 = ((biddingDeadline - currentTimestamp) + safeDelay) * 1000;
                            console.log('Wait time before calling reveal',(waitTimeInMS1/1000)) // XXX

                            setTimeout(
                                async function(error,event){
                                    try {
                                        console.log(job.jobPoster,parseInt(job.id),bidAmount,fakeBid,secret) // XXX
                                        await auctionFactory.methods.reveal(
                                            job.jobPoster,
                                            parseInt(job.id),
                                            [bidAmount],
                                            [fakeBid],
                                            [secret]
                                        ).send(
                                            {from:workerAddress, gas:'3000000'}
                                        ).on('receipt', function(receipt) {
                                            console.log('\nreveal() called'); // XXX
                                            console.log(receipt); // XXX
                                            // TODO Wait until `.revealDeadline` and then call `auctionEnd`
                                            // var revealDeadline = auctionFactory.methods.auctions(job.jobPoster,parseInt(job.id)).call().revealDeadline;
                                        })
                                    } catch(error) {
                                        console.log(error)
                                    }
                                },waitTimeInMS1
                            )

                            // TODO Call auctionEnd
                            var waitTimeInMS2 = ((revealDeadline - currentTimestamp) + safeDelay) * 1000;
                            console.log('Wait time before calling auctionEnd',(waitTimeInMS2/1000))

                            setTimeout(
                                async function(error,event){
                                    try {
                                        console.log('\nAbout to call auctionEnd()') // XXX
                                        await auctionFactory.methods.auctionEnd(
                                            job.jobPoster,
                                            parseInt(job.id)
                                        ).send(
                                            {from:workerAddress, gas:'3000000'}
                                        ).on('receipt', function(receipt) {
                                            console.log('\nauctionEnd() called'); // XXX
                                            console.log(receipt); // XXX
                                            // TODO Wait until `.revealDeadline` and then call `auctionEnd`
                                            // var revealDeadline = auctionFactory.methods.auctions(job.jobPoster,parseInt(job.id)).call().revealDeadline;
                                        })
                                    } catch(error) {
                                        console.log(error)
                                    }
                                },waitTimeInMS2
                            )
                        })
                    }
                }
            }
        )
    } catch(error) {
        // TODO Handle error
        console.log(error)
    }
})()



/*
async function procUntrainedModelAndTrainingDatasetShared(){
    let event = await jobFactoryContract.events.UntrainedModelAndTrainingDatasetShared()
    // (C) This should only listen for an event related to a job the worker's bid on,
    //     and was the highest bidder.
    try {
        // TODO
    } catch(error) {
        // TODO Handle error
        console.log(error)
    }
}

async function procTrainedModelShared(){
    let event = await jobFactoryContract.events.TrainedModelShared()
    // (C) This should only listen for an event related to a job the worker's bid on,
    //     and was the highest bidder.
    try {
        // TODO
    } catch(error) {
        // TODO Handle error
        console.log(error)
    }
}

async function procJobApproved(){
    let event = await jobFactoryContract.events.JobApproved()
    // (C) This should only listen for an event related to a job the worker's bid on,
    //     and was the highest bidder.
    try {
        // TODO
    } catch(error) {
        // TODO Handle error
        console.log(error)
    }
}
*/