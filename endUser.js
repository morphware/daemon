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



async function downloadFiles(job){
    try{
        let downloadsDir = './datalake/end_user/downloads'+`/${job.jobPoster}/${job.id}`;

        await fs.promise.mkdirSync(downloadsDir, { recursive: true });

        let links = [job.trainedModelMagnetLink]
        let count = 0;

        for (var link of links) {
            webtorrent.add(link, { path: downloadsDir }, function (torrent) {
                count++;
                torrent.on('error', console.error);
                torrent.on('downloaded', console.log);
                torrent.on('done', function(){
                    if (--count == 0) {
                        console.log('endUser3.js: trainedModelMagnetLink download finished')
                        // do stuff here on done...
                    }
                });
            });        
        }
    }catch(error){
        // Look for FS error
        console.error('ERROR!!! `downloadFiles`', error);
    }

}

jobFactoryContract.events.JobApproved({
    filter: {
        jobPoster: account4Address
    }
}, function(error, event) {
    try{
        console.log(event);
        console.log('Inside procJobApproved...'); // XXX


        var job = event.returnValues;

        console.log(job); // XXX

        // Note: `x.endUser` is the same as `account4Address`
        auctionFactory.methods.payout(
            account4Address,
            job.id
        ).send(
            {from:account4Address, gas:'3000000'}
        ).on('receipt', async function(receipt) {
            try{
                console.log('\nCalled payout funct...\n'); // XXX
                console.log(receipt); // XXX

                await downloadFiles(job);

            }catch(error){
                console.error('ERROR!!! `payout receipt`', error);
            }
        });

        // TODO Then... download trained model   
    }catch(error){
        console.error('ERROR!!! `JobApproved`', error);
    }
});
