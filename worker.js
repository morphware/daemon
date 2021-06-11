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

const auctionFactoryABIPathname = 'VickreyAuction-copyABI.json';
let auctionFactoryAbi = JSON.parse(fs.readFileSync(path.resolve(auctionFactoryABIPathname),'utf-8')).abi;

jobFactoryContract.events.JobDescriptionPosted()
    .on('data', function(event) {
        let job = event.returnValues;

        // TODO 1 Automatically approve the transfer
        // morphwareToken.approve(vickreyAuction.address,12,{from:accounts[1]});

        if (parseInt(job.trainingDatasetSize) <= maxDiskSpace) {
            if ((parseInt(job.workerReward) / (parseInt(job.estimatedTrainingTime) / 60)) >= minHourlyRate) {
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
                    // TEST
                    console.log('\nBid sent')
                    console.log('\n',receipt);

                    // TODO Wait until `.biddingDeadline` and then call `reveal`
                    var biddingDeadline = auctionFactory.auctions(job.jobPoster,parseInt(job.id)).biddingDeadline;
                    var currentTimestamp = Math.floor(new Date().getTime() / 1000);
                    setTimeout((function() {
                        // TEST
                        console.log('\nCalling reveal()');
                        auctionFactory.methods.reveal(
                            job.jobPoster,
                            parseInt(job.id),
                            [bidAmount],
                            [fakeBid],
                            [secret]
                        ).send(
                            {from:account1Address, gas:'3000000'}
                        ).on('receipt', function(receipt) {
                            // TODO Wait until `.revealDeadline` and then call `auctionEnd`
                            var revealDeadline = auctionFactory.auctions(job.jobPoster,parseInt(job.id)).revealDeadline;
                            setTimeout((function() {
                                // TEST
                                console.log('\nCalling auctionEnd()')
                                auctionFactory.methods.auctionEnd(
                                    job.jobPoster,
                                    parseInt(job.id)
                                ).send(
                                    {from:account1Address, gas:'3000000'}
                                ).on('receipt', function(receipt) {
                                    // TEST
                                    console.log('\nAuction ended');
                                    console.log('\n',receipt);
                                });
                            }),revealDeadline - currentTimestamp);
                        });
                    }),biddingDeadline - currentTimestamp);
                }).on('error', console.error);
            } else {
                // TODO 9 Handle this condition / error
                console.log('Missed inner if-block');
            }
        } else {
            // TODO 9 Handle this condition / error
            console.log('Missed outer if-block');
        }
    }).on('error', console.error);


// TODO Listen for job-posting events emitted by the smart contracts:
// 	    - JobFactory
//          x JobDescriptionPosted
//          o UntrainedModelAndTrainingDatasetShared
//          o TrainedModelShared
//          o JobApproved
//      - AuctionFactory
//          o AuctionEnded

// AuctionEnded( 
// jobFactoryContract.events.UntrainedModelAndTrainingDatasetShared()
//     .on('data', function(event) {
//         let job = event.returnValues;



// TODO vickreyAuction.withdraw({from:accounts[1]});

// TODO vickreyAuction.payout(accounts[4],0);











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