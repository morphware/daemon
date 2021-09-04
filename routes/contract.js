'use strict';

const fs = require('fs');
const path = require('path');
const router = require('express').Router();
const multer = require('multer');
const webtorrent = require('../controller/torrent');
const conf = require('../conf')

const {jobFactoryContract, auctionFactory, morphwareToken, account, web3} = require('../model/contract');




// TODO Un-hardcode this

///////////////////////////////////////////////////////////////////////////////
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        ///////////////////////
        // TODO Unhardcode the following jobId (i.e., `0`):
        var uploadsDir   = `./datalake/end_user/uploads/${account.address}/0`;  // This should be the auctionID
        if (!fs.existsSync(uploadsDir)){
            fs.mkdirSync(uploadsDir, { recursive: true });
        }
        ///////////////////////
        cb(null, uploadsDir);
    },
    // TODO 1 Create a key-value store that associates the original filename
    //        so it can be displayed in the dashboard and tracked by the user.
    filename: function (req, file, cb) {
        let ext = '';
        if (file.originalname.split('.').length > 1) {
            // cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
            cb(null, file.fieldname + path.extname(file.originalname));
        }
    }
});

var upload = multer({storage:storage});
var validFields = upload.fields([
    {name:'jupyter-notebook',maxCount:1},
    {name:'training-data',maxCount:1},
    {name:'testing-data',maxCount:1}
]);
///////////////////////////////////////////////////////////////////////////////

router.post('/', validFields, async function (req, res) {
    try{

        // TEST
        // TODO 9 Incorporate `fileFilter`

        ///////////////////////////////////////////////////////////////////////////////
        const fieldsObj = JSON.parse(req.body.fields);

        // TEST

        ///////////////////////////////////////////////////////////////////////////////
        // `nbconvert`
        
        // var untrainedModelFile = req.files['jupyter-notebook'][0];
        // console.log('untrainedModelFile:',untrainedModelFile);

        // if (path.extname(untrainedModelFile.originalname) == `.ipynb`) {
        //     console.log('Converting Jupyter notebook...')
        //     // FIXME
        //             // TODO Unhardcode the following jobId (i.e., `0`), and wallet address:
        //     var untrainedModelPath = `./datalake/end_user/uploads/${account.address}/0`
        //     var untrainedModelFilePathname  = untrainedModelPath + `/${untrainedModelFile.originalname}`;
        //     var outPathname                 = untrainedModelPath + `/${untrainedModelFile.fieldname}.py`;

        //     console.log('untrainedModelFilePathname',untrainedModelFilePathname)
        //     console.log('outPathname',outPathname)
            
        //     const notebookConversionProc = spawn("python", ["-m","nbconvert","--to","python",untrainedModelFilePathname,"--output",outPathname], {shell: true});
        //     var dataToSend;

        //     // collect data from script
        //     notebookConversionProc.stdout.on('data', function (data) {
        //         console.log('Pipe data from python script ...');
        //         dataToSend = data.toString();
        //     });
        //      // in close event we are sure that stream from child process is closed
        //     notebookConversionProc.on('close', (code) => {
        //         console.log(`child process close all stdio with code ${code}`);
        //         // FIXME Do something else here instead
        //         // send data to browser
        //         // res.send(dataToSend)

        //         console.log(dataToSend);
        //     });

        // } else if (path.extname(file.originalname) == `.py`) {
        //     console.log('Not converting Python file...')
        // } else {
        //     console.log('Something is wrong!  Upload is neither a Jupyter notebook or Python file.')
        // }
        ///////////////////////////////////////////////////////////////////////////////

        var biddingDeadline = Math.floor(new Date().getTime() / 1000) + parseInt(fieldsObj['bidding-time'])
        var revealDeadline = biddingDeadline+30  // TODO Replace this

        var workerReward = parseInt(fieldsObj['worker-reward']);

        var tx = {
            from: account.address,
            data: morphwareToken.methods.transfer(conf.auctionFactoryContractAddress, workerReward).encodeABI(), 
            gas:"3000000"
        }
        const signPromise = await account.signTransaction(tx);
        console.log('signPromise', signPromise.rawTransaction);
        const send = await web3.eth.sendSignedTransaction(signPromise.rawTransaction);

        console.log('send', send);



        jobFactoryContract.methods.postJobDescription(
            parseInt(fieldsObj['training-time']),
            parseInt(req.files['training-data'][0].size),
            parseInt(fieldsObj['error-rate']),
            parseInt(workerReward*.1),
            biddingDeadline,
            revealDeadline,
            workerReward
        ).send(
            {from: account.address, gas:"3000000"}
        ).on('receipt', function(receipt){

    	    // TODO Call auctionEnd
    	    var waitTimeInMS2 = ((revealDeadline - currentTimestamp) + safeDelay) * 1000;
    	    console.log('Wait time before calling auctionEnd',(waitTimeInMS2/1000))

    	    setTimeout(function(error,event){
    	        try {
    	            console.log('\nAbout to call auctionEnd()') // XXX
    	            auctionFactory.methods.auctionEnd(
    	                job.jobPoster,
    	                parseInt(job.id)
    	            ).send(
    	                {from:account.address, gas:'3000000'}
    	            ).on('receipt', function(receipt) {
    	                console.log('\nauctionEnd() called'); // XXX
    	                console.log(receipt); // XXX
    	                // TODO Wait until `.revealDeadline` and then call `auctionEnd`
    	                // var revealDeadline = auctionFactory.methods.auctions(job.jobPoster,parseInt(job.id)).call().revealDeadline;
    	            })
    	        } catch(error) {
    	            console.log(error)
    	        }
    	    }, waitTimeInMS2);
        });


        var links = {};

        let count = 0; // FIXME Change this back to 3
        for (const [_fieldname, _fileArray] of Object.entries(req.files)) {
            let f = _fileArray[0].path;
            
            links[_fieldname] = webtorrent;

            webtorrent.seed(f, function (torrent) {
            // webtorrent.seed(f, async function (e, torrent) {
            // TODO 1
                if (--count == 0) {
                    

                    var d = {}

                    d['jupyter-notebook'] = links['jupyter-notebook'].torrents[0].magnetURI;
                    d['training-data']    = links['training-data'].torrents[0].magnetURI;
                    d['testing-data']     = links['testing-data'].torrents[0].magnetURI;

                    var dObj = JSON.stringify(d);

                    // TODO 9 Replace links with a more descriptive filename
                    fs.writeFile("links.json", dObj, function(err, result) {
                        if(err) console.log('error', err);
                    });


                }
            });
        }

        // TODO 8 Send a legitimate response
        res.send('success');



    }catch(error){
        console.log('ERROR!!! `post contract`', error.lineNuber, error, error.stack)
    }
});

module.exports = router;
