const fs         = require('fs');
const path       = require('path');
const WebTorrent = require('webtorrent-hybrid');
const Web3       = require('web3');
const { URL }    = require('url');

// 9 TODO Import dependency structure from one file

const webtorrent = new WebTorrent();

var provider = new Web3.providers.WebsocketProvider('ws://localhost:8545');
let web3 = new Web3(provider);

var workerAddress = '0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0';

const jobFactoryContractAddress = '0xC89Ce4735882C9F0f0FE26686c53074E09B0D550';
const jobFactoryAbiPathname = './abi/JobFactory-copyABI.json';
let jobFactoryAbi = JSON.parse(fs.readFileSync(path.resolve(jobFactoryAbiPathname),'utf-8')).abi;
let jobFactoryContract = new web3.eth.Contract(jobFactoryAbi,jobFactoryContractAddress);


function downloadFile(job){

    var downloadsDir = './datalake/worker_node/downloads'+`/${job.jobPoster}/${job.id}`;

    if (!fs.existsSync(downloadsDir)){
        fs.mkdirSync(downloadsDir, { recursive: true });
    }

    var links = [job.untrainedModelMagnetLink, job.trainingDatasetMagnetLink]

    for (var link of links) {
        webtorrent.add(link, { path: downloadsDir }, function (torrent) {
            torrent.on('done', function () {
                console.log('untrainedModelMagnetLink download finished')
            })
        });        
    }
}


(function procUntrainedModelAndTrainingDatasetShared(){
    // (C) This should only listen for an event related to a job the worker's bid on,
    //     and was the highest bidder.
    try {
        console.log('\nworker2 listening for procUntrainedModelAndTrainingDatasetShared from JobFactory...') // XXX

        jobFactoryContract.events.UntrainedModelAndTrainingDatasetShared(
            { filter: { workerNode: workerAddress } },
            function(error, event) {

                console.log('event',event);
                console.log('\nInside procUntrainedModelAndTrainingDatasetShared await...\n'); // XXX


                var job = event.returnValues;
                console.log('job:',job); // XXX

                // var downloadsDir = './datalake/worker_node/downloads'+`/${x.jobPoster}/${x.id}`;

                // if (!fs.existsSync(downloadsDir)){
                //     fs.mkdirSync(downloadsDir, { recursive: true });
                // }

                // webtorrent.add(x.untrainedModelMagnetLink, { path: downloadsDir }, function (torrent) {
                //     torrent.on('done', function () {
                //         console.log('untrainedModelMagnetLink download finished')
                //     })
                // });

                // webtorrent.add(x.trainingDatasetMagnetLink, { path: downloadsDir }, function (torrent) {
                //     torrent.on('done', function () {
                //         console.log('trainingDatasetMagnetLink download finished')
                //     })
                // });

                downloadFile(job)

                // FIXME Need something like process.exit() because it seems like the files aren't accessible until this file stops running

            }
        )
    } catch(error) {
        // TODO Handle error
        console.log(error)
    }
})()