'use strict';

const fs         = require('fs');
const path       = require('path');
<<<<<<< HEAD
const webtorrent = require('./controller/torrent');
const conf       = require('./conf');
const {jobFactoryContract, morphwareToken, web3} = require('./model/contract');

const account4Address = '0xd03ea8624C8C5987235048901fB614fDcA89b117';

var auctionFactoryABIPathname = './abi/VickreyAuction-RopstenABI.json';
var auctionFactoryAbi = JSON.parse(fs.readFileSync(path.resolve(auctionFactoryABIPathname),'utf-8')).abi;

var auctionFactory = new web3.eth.Contract(
    auctionFactoryAbi,
    conf.auctionFactoryContractAddress
);


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



auctionFactory.events.AuctionEnded({
    filter: {
        endUser: account4Address 
    }
}, function(error, event) {
    try{
        if(!event) return false;
        console.log('Inside procAuctionEnded...', event, error); // XXX


        var x = event.returnValues;
=======
const Web3       = require('web3');
const { URL }    = require('url');
const {jobFactoryContract, auctionFactory} = require('./model/contract');
const conf       = require('./conf');

auctionFactory.events.AuctionEnded(
    { filter: { endUser: conf.account4Address } },
    function(error, event) {
        if(error){
            console.error('enduser auctionFactory error', error);
            throw(error);
        }

        console.log('arg', arguments)
        console.log(event);
        console.log('Inside procAuctionEnded await...'); // XXX


        var contractData = event.returnValues;
        // TODO May need to check the local disk space again, 
        //      because the training data may not fit if it
        //      changed.
        console.log(contractData);
>>>>>>> d7012d38fdbe011548a8a38db54ec65c15be4ef1

        var magnetLinks = JSON.parse(fs.readFileSync('./links.json','utf-8'));;
        

<<<<<<< HEAD
        // Note: `x.endUser` is the same as `account4Address`
        jobFactoryContract.methods.shareUntrainedModelAndTrainingDataset(
            x.auctionId,
            magnetLinks['jupyter-notebook'],
            magnetLinks['training-data']
        ).send(
            {from:account4Address, gas:'3000000'}
        ).on('receipt', async function(receipt) {
            console.log('\nShared untrained model and training dataset...\n'); // XXX
            console.log(receipt); // XXX
        });

    }catch(error){
        console.error('ERROR!!! `AuctionEnded`', error)
    }    
});

jobFactoryContract.events.TrainedModelShared({
    filter: {
        jobPoster: account4Address
    }
}, function(error, event){
    try{

        if(!event) return false;

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
    }catch(error){
        console.error('ERROR!!! `TrainedModelShared`', error);
    }
})
=======
        // TEST
        console.log(magnetLinks) // XXX


        // TEST
        console.log(typeof(magnetLinks['jupyter-notebook'])) // XXX
        console.log(typeof(magnetLinks['training-data'])) // XXX
        console.log(magnetLinks['jupyter-notebook']) // XXX
        console.log(magnetLinks['training-data']) // XXX

        // Note: `x.endUser` is the same as `conf.account4Address`
        jobFactoryContract.methods.shareUntrainedModelAndTrainingDataset(
            conf.account4Address,
            contractData.auctionId,
            magnetLinks['jupyter-notebook'],
            magnetLinks['training-data']
        ).send(
            {from:conf.account4Address, gas:'3000000'}
        ).on('receipt', async function(receipt) {
            try{
                console.log('\nShared untrained model and training dataset...\n'); // XXX
                console.log(receipt); // XXX

            }catch(error){
                console.error(error);
>>>>>>> d7012d38fdbe011548a8a38db54ec65c15be4ef1

jobFactoryContract.events.JobApproved({
    filter: {
        jobPoster: account4Address
    }
}, function(error, event) {
    try{
        if(!event) return false;
        console.log(event);
        console.log('Inside procJobApproved...'); // XXX

        var job = event.returnValues;

        // Note: `x.endUser` is the same as `account4Address`
        auctionFactory.methods.payout(
            account4Address,
            job.id
        ).send({
            from:account4Address, gas:'3000000'
        }).on('receipt', async function(receipt) {
            try{
                console.log('\nCalled payout funct...\n'); // XXX
                console.log(receipt); // XXX

                await downloadFiles(job);

            }catch(error){
                console.error('ERROR!!! `payout receipt`', error);
            }
<<<<<<< HEAD
        });

    }catch(error){
        console.error('ERROR!!! `JobApproved`', error);
    }
});
=======
        })
    }
);
>>>>>>> d7012d38fdbe011548a8a38db54ec65c15be4ef1
