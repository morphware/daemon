const fs         = require('fs');
const path       = require('path');
const WebTorrent = require('webtorrent-hybrid');
const Web3       = require('web3');
const { URL }    = require('url');
const { spawn }  = require('child_process');
const glob       = require('glob');

// 9 TODO Import dependency structure from one file

const webtorrent = new WebTorrent();

webtorrent.on('error', console.error);

var provider = new Web3.providers.WebsocketProvider('ws://localhost:8545');
let web3 = new Web3(provider);

var workerAddress = '0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0';

const jobFactoryContractAddress = '0xC89Ce4735882C9F0f0FE26686c53074E09B0D550';
const jobFactoryAbiPathname = './abi/JobFactory-copyABI.json';
let jobFactoryAbi = JSON.parse(fs.readFileSync(path.resolve(jobFactoryAbiPathname),'utf-8')).abi;
let jobFactoryContract = new web3.eth.Contract(jobFactoryAbi,jobFactoryContractAddress);


function downloadFile(job){

    var downloadsDir = './datalake/worker_node/downloads'+`/${job.jobPoster}/${job.id}`;
    var uploadsDir   = './datalake/worker_node/uploads'+`/${job.jobPoster}/${job.id}`;
    var directories  = [downloadsDir, uploadsDir]
    for (var directory of directories) {
        if (!fs.existsSync(directory)){
            fs.mkdirSync(directory, { recursive: true });
        }
    }

    var links = [job.untrainedModelMagnetLink, job.trainingDatasetMagnetLink]

    let count = 2;
    for (var link of links) {
        webtorrent.add(link, { path: downloadsDir }, function (torrent) {
            // if (link == job.untrainedModelMagnetLink) {
            //     var model_file = torrent.path + '/' + torrent.files[0].path;
            // }
            torrent.on('error', console.error);
            torrent.on('downloaded', console.log);
            torrent.on('done', function () {
                console.log(count, 'files', torrent.files)
                if (--count == 0) {

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
                    const trainingProc = spawn('python3', [`${model_file}`], {shell: true});
                    // const trainingProc = spawn('python3', [`${model_file}`]);


                    var trainingErrorRate;
                    // collect data from script
                    trainingProc.stdout.on('data', function (data) {
                        console.log('Pipe data from Python script ...');
                        trainingErrorRate = data.toString();
                    });
                     // in close event we are sure that stream from child process is closed
                    trainingProc.on('close', (code) => {
                        console.log(`child process close all stdio with code ${code}`);

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
                    });
                    ////////////////

                }
            })
            // TODO Handle `torrent.on('error')`
        });
    }

}


(function procUntrainedModelAndTrainingDatasetShared(){
    // (C) This should only listen for an event related to a job the worker's bid on,
    //     and was the highest bidder.
    try {
        console.log('\nworker2 listening for UntrainedModelAndTrainingDatasetShared from JobFactory...') // XXX

        jobFactoryContract.events.UntrainedModelAndTrainingDatasetShared(
            { filter: { workerNode: workerAddress } },
            function(error, event) {

                // console.log('event',event);
                console.log('\nInside procUntrainedModelAndTrainingDatasetShared await...\n'); // XXX


                var job = event.returnValues;
                // console.log('job:',job); // XXX

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

                downloadFile(job);

                // FIXME Need something like process.exit() because it seems like the files aren't accessible until this file stops running
                // process.exit()
            }
        )
    } catch(error) {
        // TODO Handle error
        console.log(error)
    }
})()