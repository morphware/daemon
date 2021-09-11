'use strict';

const fs = require('fs');
const path = require('path');
const router = require('express').Router();
const multer = require('multer');
const webtorrent = require('../controller/torrent');

const {wallet} = require('../model/morphware');
const conf = require('../conf')


const {
    web3,
    jobFactoryContract,
    auctionFactory,
    morphwareToken,
} = require('../model/contract');


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

router.post('/', validFields, async function (req, res, next) {
    try{

        ///////////////////////////////////////////////////////////////////////////////
        const fieldsObj = JSON.parse(req.body.fields);

        var links = {};

        let count = 0
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

        var workerReward = fieldsObj['worker-reward'];
        var biddingDeadline = Math.floor(new Date().getTime() / 1000) + parseInt(fieldsObj['bidding-time'])
        var revealDeadline = biddingDeadline+30  // TODO Replace this



        let transfer = await wallet.send(
            conf.auctionFactoryContractAddress,
            web3.utils.toWei(workerReward.toString())
        );

        // console.log('transfer', transfer)

        let receipt = await jobFactoryContract.methods.postJobDescription(
            parseInt(fieldsObj['training-time']),
            parseInt(req.files['training-data'][0].size),
            parseInt(fieldsObj['error-rate']),
            parseInt(workerReward*.1),
            biddingDeadline,
            revealDeadline,
            workerReward
        ).send(
            {from: account.address, gas:"3000000"}
        );

        console.log('receipt', receipt, receipt.events.JobDescriptionPosted.returnValues);

        let job = receipt.events.JobDescriptionPosted.returnValues

	    setTimeout(async function(){
	        try {
	            console.log('\nAbout to call auctionEnd()') // XXX
	            let receipt = await auctionFactory.methods.auctionEnd(
	                job.jobPoster,
	                parseInt(job.id)
	            ).send(
	                {from: account.address, gas:'3000000'}
	            )

                console.log('auctionEnd', receipt)
	        } catch(error) {
	            console.log(error)
	        }
	    }, 30000);

        return res.json({status:'success', receipt})

    }catch(error){
        next(error)
    }
});

module.exports = router;


