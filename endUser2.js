const fs         = require('fs');
const path       = require('path');
const WebTorrent = require('webtorrent-hybrid');
const Web3       = require('web3');

// 9 TODO Import dependency structure from one file

const webtorrent = new WebTorrent();

var provider = new Web3.providers.WebsocketProvider('ws://localhost:8545');
let web3 = new Web3(provider);

const account4Address = '0xd03ea8624C8C5987235048901fB614fDcA89b117';

const jobFactoryContractAddress = '0xC89Ce4735882C9F0f0FE26686c53074E09B0D550';
const jobFactoryAbiPathname = './abi/JobFactory-copyABI.json';
let jobFactoryAbi = JSON.parse(fs.readFileSync(path.resolve(jobFactoryAbiPathname),'utf-8')).abi;
let jobFactoryContract = new web3.eth.Contract(jobFactoryAbi,jobFactoryContractAddress);

var auctionFactoryContractAddress = '0x254dffcd3277C0b1660F6d42EFbB754edaBAbC2B';
var auctionFactoryABIPathname = './abi/VickreyAuction-copyABI.json';
var auctionFactoryAbi = JSON.parse(fs.readFileSync(path.resolve(auctionFactoryABIPathname),'utf-8')).abi;

var auctionFactory = new web3.eth.Contract(auctionFactoryAbi,auctionFactoryContractAddress);



(function procTrainedModelShared(){
    try {
        console.log('\nendUser node listening for TrainedModelShared from JobFactory...') // XXX


        jobFactoryContract.events.TrainedModelShared(
            { filter: { jobPoster: account4Address } },
            function(error, event) {

                console.log(event); // XXX
                console.log('Inside TrainedModelShared...'); // XXX


                var job = event.returnValues;

                console.log(job); // XXX

                var magnetLinks = JSON.parse(fs.readFileSync('./links.json','utf-8'));;


                console.log(magnetLinks['testing-data']) // XXX


                jobFactoryContract.methods.shareTestingDataset(
                    job.id,
                    job.trainedModelMagnetLink,
                    magnetLinks['testing-data']
                ).send(
                    {from:account4Address, gas:'3000000'}
                ).on('receipt', async function(receipt) {
                    console.log('\nShared testing dataset...\n'); // XXX
                    console.log(receipt); // XXX
                })


            }
        )
    } catch(error) {
        // TODO Handle error
        console.log(error)
    }
})()