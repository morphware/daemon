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
            resolve(code)
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

// (C) This should only listen for an event related to a job the worker's bid on,
//     and was the highest bidder.
jobFactoryContract.events.UntrainedModelAndTrainingDatasetShared({
    filter:{
        workerNode: workerAddress
    }
}, async function(error, event){
    try{
        // console.log('event',event);
        console.log('\nInside procUntrainedModelAndTrainingDatasetShared await...\n'); // XXX
        var job = event.returnValues;

        await downloadFiles(job);
        await executeNoteBook(job);

    }catch(error){
        console.error('ERROR!!! `UntrainedModelAndTrainingDatasetShared` listener', error);
    }
})