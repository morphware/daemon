const fs         = require('fs');
const path       = require('path');
const WebTorrent = require('webtorrent-hybrid');
const Web3       = require('web3');
const { URL }    = require('url');
const { spawn }  = require('child_process');

// 9 TODO Import dependency structure from one file

const webtorrent = new WebTorrent();

var provider = new Web3.providers.WebsocketProvider('ws://localhost:8545');
let web3 = new Web3(provider);

var validatorAddress = '0x95cED938F7991cd0dFcb48F0a06a40FA1aF46EBC';

const jobFactoryContractAddress = '0xC89Ce4735882C9F0f0FE26686c53074E09B0D550';
const jobFactoryAbiPathname = './abi/JobFactory-copyABI.json';
let jobFactoryAbi = JSON.parse(fs.readFileSync(path.resolve(jobFactoryAbiPathname),'utf-8')).abi;
let jobFactoryContract = new web3.eth.Contract(jobFactoryAbi,jobFactoryContractAddress);


/*

TODO Python:

model = keras.models.load_model("trained_model.h5")


*/


function downloadFile(job){

    var downloadsDir = './datalake/validator_node/downloads'+`/${job.jobPoster}/${job.id}`;

    if (!fs.existsSync(downloadsDir)){
        fs.mkdirSync(downloadsDir, { recursive: true });
    }

    var links = [job.trainedModelMagnetLink,job.testingDatasetMagnetLink]
    let count = 2;

    for (var link of links) {
        webtorrent.add(link, { path: downloadsDir }, function (torrent) {
            torrent.on('error', console.error);
            torrent.on('downloaded', console.log);
            torrent.on('done', function () {
                console.log(count, 'files', torrent.files)
                if (--count == 0) {
                    console.log('Downloads finished')

                    var trainedModelPathname = downloadsDir+'/trained_model.h5'
                    console.log('trainedModelPathname:',trainedModelPathname)

                    // FIXME

                    const testingProc = spawn('python3', [`${trainedModelPathname}`], {shell: true});

                    var otsError;
                    // collect data from script
                    testingProc.stdout.on('data', function (data) {
                        console.log('Pipe data from Python script ...');
                        console.log('data type:',typeof(data)) // XXX

                        otsError = data.toString(); // TODO

                        console.log('otsError type:',typeof(otsError)) // XXX
                    });
                     // Assure that the stream from the child process is closed
                    testingProc.on('close', (code) => {
                        console.log(`child process close all stdio with code ${code}`);

                        // TODO Incorporate some margin of error
                        if (parseInt(otsError) <= job.targetErrorRate) {

                            jobFactoryContract.methods.approveJob(
                                job.jobPoster,
                                parseInt(job.id),
                                job.trainedModelMagnetLink
                            ).send(
                                {from:validatorAddress, gas:'3000000'}
                            ).on('receipt', async function(receipt) {
                                console.log('\nApproved job...\n'); // XXX
                                console.log(receipt); // XXX
                            })
                        } else {
                            // TODO Change this
                            console.log('\n\n\nThis model sucks!\n\n\n')
                        }
                    });
                }
            })
        });        
    }

}

(function procTestingDatasetShared(){

    try {
        console.log('\nvalidator-node listening for TestingDatasetShared from JobFactory...') // XXX


        // TODO Add a filter so that the validator node doesn't listen for its own jobs?
        //      --> Obviously need to check for the addresses to match at the service layer / 
        //          smart contract level, as well
        jobFactoryContract.events.TestingDatasetShared(
            function(error, event) {

                console.log('\nevent:',event); // XXX
                console.log('\nInside procTestingDatasetShared...\n'); // XXX

                var job = event.returnValues;
                console.log('job:',job); // XXX

                downloadFile(job);

            }
        )
    } catch(error) {
        // TODO Handle error
        console.log(error)
    }
})()