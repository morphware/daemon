'use strict';

const fs         = require('fs');
const path       = require('path');
const { spawn }  = require('child_process');
const disk       = require('diskusage');
const webtorrent = require('./controller/torrent');

const {jobFactoryContract, morphwareToken, web3} = require('./model/contract');

var workerAddress = '0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0';
var auctionFactoryABIPathname = './abi/VickreyAuction-RopstenABI.json';
var auctionFactoryAbi = JSON.parse(fs.readFileSync(path.resolve(auctionFactoryABIPathname),'utf-8')).abi;

async function checkDisk(size){
    try{
        let {free} = await disk.check('/');

        return size <= free ? true : false;
    }catch(error){
        console.error('ERROR!!!, `chechDisk`', error)
    }
}

function processPostedJob(job){
    var auctionFactory = new web3.eth.Contract(auctionFactoryAbi, job.auctionAddress);

    var bidAmount = 11;
    var fakeBid = false;
    var secret = '0x6d6168616d000000000000000000000000000000000000000000000000000000';

    auctionFactory.methods.bid(
        job.jobPoster,
        parseInt(job.id),
        web3.utils.keccak256(web3.utils.encodePacked(bidAmount,fakeBid,secret)),
        bidAmount
    ).send({
        from:workerAddress,
        gas:'3000000'
    }).on('receipt', async function(receipt) {
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

        setTimeout(function(error, event){
            try {
                console.log(job.jobPoster,parseInt(job.id),bidAmount,fakeBid,secret) // XXX
                auctionFactory.methods.reveal(
                    job.jobPoster,
                    parseInt(job.id),
                    [bidAmount],
                    [fakeBid],
                    [secret]
                ).send({
                    from:workerAddress, gas:'3000000'
                }).on('receipt', function(receipt) {
                    console.log('\nreveal() called'); // XXX
                    console.log(receipt); // XXX
                    // TODO Wait until `.revealDeadline` and then call `auctionEnd`
                    // var revealDeadline = auctionFactory.methods.auctions(job.jobPoster,parseInt(job.id)).call().revealDeadline;
                });
            } catch(error) {
                console.log(error)
            }
        }, waitTimeInMS1);
    });
}


async function seedTrainedData(job){
    try{
        // FIXME  Seed `trained_model.h5`
        let afterTrainingCount = 1;
        // let webtorrent2 = new WebTorrent();
        trainedModelPathname = `./datalake/worker_node/uploads/${job.jobPoster}/${job.id}/trained_model.h5`
        
        webtorrent.seed(trainedModelPathname, function (torrent) {
            if (--afterTrainingCount == 0) {

                // TODO Should this be re-factored as a new webtorrent object?
                //      --> Is `trained_model.h5`'s magnet-link guaranteed to be in the third zero-based index-position?
                var trainedModelMagnetLink = webtorrent.torrents[2].magnetURI;

                console.log('trainedModelMagnetLink:',trainedModelMagnetLink)
                console.log('trainingErrorRate:',trainingErrorRate);

                jobFactoryContract.methods.shareTrainedModel(
                    job.jobPoster,
                    parseInt(job.id),
                    trainedModelMagnetLink,
                    parseInt(trainingErrorRate)
                ).send(
                    {from:workerAddress, gas:"3000000"}
                );
            }
        })  
    }catch(error){
        console.log('ERROR!!! `seedTrainedData function`', error);
    }
}

function executeNoteBook(){
    return new Promise((resolve, reject)=>{
        console.log('untrainedModelMagnetLink and trainingDatasetMagnetLink download finished')
        // FIXME Call `process.exit()` like the decrementing counter, here
        // process.exit()

        ////////////////
        var model_file = `./datalake/worker_node/downloads/${job.jobPoster}/${job.id}/jupyter-notebook.ipynb`
        console.log('model_file:',model_file)

        // Run the Jupyter notebook //////////////
        // spawn new child process to call the python script

        // TODO Add `detached:true` to dict-like object parameterized at the end of `spawn`?
        //
        // FIXME Remove `shell:true` (security consideration) and have the user add the full-path to the Python file
        const child = spawn('python3', [`${model_file}`], {shell: true});
        // const child = spawn('python3', [`${model_file}`]);


        var trainingErrorRate;
        // collect data from script
        child.stdout.on('data', function (data) {
            console.log('Pipe data from Python script ...');
            trainingErrorRate = data.toString();
        });

        child.on('error', function(data){
            console.error('ERROR!!! `executeNoteBook` child error', data);
            reject(data);
        })

        // in close event we are sure that stream from child process is closed
        child.on('close', (code) => {
            console.log(`child process close all stdio with code ${code}`);

            // check exit code here
            resolve(code);
        });
    });
}

async function downloadFiles(job){
    try{
        var downloadsDir = './datalake/worker_node/downloads'+`/${job.jobPoster}/${job.id}`;
        var uploadsDir   = './datalake/worker_node/uploads'+`/${job.jobPoster}/${job.id}`;
        var directories  = [downloadsDir, uploadsDir]

        for (var directory of directories) {
            await fs.promise.mkdir(directory, { recursive: true });
        }

        var links = [job.untrainedModelMagnetLink, job.trainingDatasetMagnetLink]
        let count = 0;

        for (var link of links) {
            webtorrent.add(link, { path: downloadsDir }, function (torrent) {
                count++;
                // if (link == job.untrainedModelMagnetLink) {
                //     var model_file = torrent.path + '/' + torrent.files[0].path;
                // }
                torrent.on('error', console.error);
                torrent.on('downloaded', console.log);
                torrent.on('done', function () {
                    console.log(count, 'files', torrent.files)
                    if (--count == 0) {
                        return true;
                    }
                });
            });
        }
    }catch{
        // Watch for FS errors here
        console.error('ERROR!!! `downloadFiles`', error);
    }
}

jobFactoryContract.events.JobDescriptionPosted(async function(error, event) {
    try{
        if(!event) return false;
        var job = event.returnValues;

        if(!await checkDisk(job.trainingDatasetSize)){
            console.info('not enough free disk space, passing');
            return false;
        }

        await processPostedJob(job);
    }catch(error){
        console.error('ERROR!!! ``', error);
    }
});

// (C) This should only listen for an event related to a job the worker's bid on,
//     and was the highest bidder.
jobFactoryContract.events.UntrainedModelAndTrainingDatasetShared({
    filter:{
        workerNode: workerAddress
    }
}, async function(error, event){
    try{
        if(!event) return false;
        // console.log('event',event);
        console.log('\nInside procUntrainedModelAndTrainingDatasetShared await...\n'); // XXX
        var job = event.returnValues;

        await downloadFiles(job);
        await executeNoteBook(job);
        await seedTrainedData(job);

    }catch(error){
        console.error('ERROR!!! `UntrainedModelAndTrainingDatasetShared` listener', error);
    }
});
