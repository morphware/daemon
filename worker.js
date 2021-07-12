#!/usr/bin/env node

const fs   = require('fs');
const path = require('path');
const Web3 = require('web3');
const disk = require('diskusage');
const WebTorrent = require('webtorrent-hybrid');
const {jobFactoryContract} = require('./model/contract')

var provider = new Web3.providers.WebsocketProvider('ws://localhost:8545');
var web3 = new Web3(provider);

var workerAddress = '0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0';

var minHourlyRate = 5; // TODO Compare this to cost of running on a cloud, as an upper bound, and mining a crypto, as a lower bound

var auctionFactoryABIPathname = './abi/VickreyAuction-copyABI.json';
var auctionFactoryAbi = JSON.parse(fs.readFileSync(path.resolve(auctionFactoryABIPathname),'utf-8')).abi;

/*
TODO Listen for job-posting events emitted by the smart contracts:
     - JobFactory
       v  1. JobDescriptionPosted
       o  3. UntrainedModelAndTrainingDatasetShared
       o  4. TrainedModelShared
       o  5. JobApproved
     - AuctionFactory
       v  2. AuctionEnded
*/


console.log('\nWorker node listening for JobDescriptionPosted from JobFactory...') // XXX

        // jobFactoryContract.once('JobDescriptionPosted', async function(error, event) {
jobFactoryContract.events.JobDescriptionPosted(function(error, event) {
    try{
        console.log('error',error)
        console.log('event',event)

        // let event = await jobFactoryContract.events.JobDescriptionPosted()
        var job = event.returnValues;

        // TEST
        console.log('job',job) // XXX

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


                auctionFactory.methods.bid(
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

                    setTimeout(function(error,event){
                        try {
                            console.log(job.jobPoster,parseInt(job.id),bidAmount,fakeBid,secret) // XXX
                            auctionFactory.methods.reveal(
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
                    }, waitTimeInMS1);

                    // TODO Call auctionEnd
                    var waitTimeInMS2 = ((revealDeadline - currentTimestamp) + safeDelay) * 1000;
                    console.log('Wait time before calling auctionEnd',(waitTimeInMS2/1000))

                    setTimeout(function(error,event){
                        try {
                            console.log('\nAbout to call auctionEnd()') // XXX
                            auctionFactory.methods.auctionEnd(
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
                    }, waitTimeInMS2);
                })
            }
        }


    }catch(error){
        console.log(error);
        // throw error;
    }
})




// (function procUntrainedModelAndTrainingDatasetShared(){
//     // (C) This should only listen for an event related to a job the worker's bid on,
//     //     and was the highest bidder.
//     try {
//         jobFactoryContract.events.UntrainedModelAndTrainingDatasetShared(
//             { filter: { workerNode: workerAddress } },
//             function(error, event) {

//                 let webtorrent = new WebTorrent();

//                 webtorrent.add()

//                 var downloadsDir = './datalake/worker_node/downloads'



//             }

//         )



//     } catch(error) {
//         // TODO Handle error
//         console.log(error)
//     }
// }










/*
async function procTrainedModelShared(){
    // (C) This should only listen for an event related to a job the worker's bid on,
    //     and was the highest bidder.
    try {
        // TODO
        jobFactoryContract.events.TrainedModelShared()
    } catch(error) {
        // TODO Handle error
        console.log(error)
    }
}

async function procJobApproved(){
    // (C) This should only listen for an event related to a job the worker's bid on,
    //     and was the highest bidder.
    try {
        // TODO
        jobFactoryContract.events.JobApproved()
    } catch(error) {
        // TODO Handle error
        console.log(error)
    }
}
*/