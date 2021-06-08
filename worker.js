#!/usr/bin/env node
const fs   = require('fs');
const path = require('path');
const Web3 = require('web3');
const disk = require('diskusage');

const provider = new Web3.providers.WebsocketProvider('ws://localhost:8545');
let web3 = new Web3(provider);

// TODO Un-hardcode these three
const account1Address = '0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0';
const jobFactoryContractAddress = '0xC89Ce4735882C9F0f0FE26686c53074E09B0D550';
const jobFactoryABIPathname = 'JobFactory-copyABI.json';

let jobFactoryAbi = JSON.parse(fs.readFileSync(path.resolve(jobFactoryABIPathname),'utf-8')).abi;
let jobFactoryContract = new web3.eth.Contract(jobFactoryAbi,jobFactoryContractAddress);

var maxDiskSpace;
disk.check('/', function(err, sysinfo) {
    maxDiskSpace = sysinfo.free;
});

var minHourlyRate = 5; // TODO Compare this to cost of running on a cloud, as an upper bound, and mining a crypto, as a lower bound

// TODO Listen for job-posting events emitted by the smart contracts:
// 	    - JobFactory
//          - JobDescriptionPosted
//          - UntrainedModelAndTrainingDatasetShared
//          - TrainedModelShared
//          - JobApproved
//      - AuctionFactory
//          - AuctionEnded
const auctionFactoryABIPathname = 'VickreyAuction-copyABI.json';
let auctionFactoryAbi = JSON.parse(fs.readFileSync(path.resolve(auctionFactoryABIPathname),'utf-8')).abi;

jobFactoryContract.events.JobDescriptionPosted()
    .on('data', function(event) {
        let job = event.returnValues;

        // FIXME Need to approve the transfer to bid
        // morphwareToken.approve(vickreyAuction.address,12,{from:accounts[1]});



        // TEST
        // console.log(job);
        // console.log(typeof job.trainingDatasetSize);
        // console.log(typeof job.workerReward);
        // console.log(typeof job.estimatedTrainingTime);
        // console.log(job.auctionAddress);

        if (parseInt(job.trainingDatasetSize) <= maxDiskSpace) {
            if ((parseInt(job.workerReward) / (parseInt(job.estimatedTrainingTime) / 60)) >= minHourlyRate) {
                // TODO Bid on the job
                let auctionFactory = new web3.eth.Contract(auctionFactoryAbi,job.auctionAddress);
                // TODO Replace `bidAmount` with some notion of utility, based on number of CUDA cores
                var bidAmount = 11;
                var fakeBid = false;
                // TODO Replace `secret`
                var secret = '0x6d6168616d000000000000000000000000000000000000000000000000000000';
                auctionFactory.methods.bid(
                    job.jobPoster,
                    parseInt(job.id),
                    web3.utils.keccak256(web3.utils.encodePacked(bidAmount,fakeBid,secret)),
                    bidAmount,
                ).send(
                    {from:account1Address, gas:'3000000'}
                ).on('receipt', function(receipt) {
                    // TODO
                    // TEST
                    console.log('bid sent')
                    console.log(receipt);
                    
                }).on('error', console.error);
            } else {
                console.log('Missed inner if-block');
            }
        } else {
            console.log('Missed outer if-block');
        }
    }).on('error', console.error);





// Download ///////////////////////////////////////////////////////////////////

// TODO Replace `magnet: ...` with a magnet link to the file to be downloaded
// var magnetURI = 'magnet: ...'

// TODO Create a directory with the user's wallet address, or the job's GUID,
//      if one doesn't already exist
// client.add(magnetURI, { path: '/path/to/folder' }, function (torrent) {
//     torrent.on('done', function () {
//         console.log('torrent download finished')
//     })
// })