'use strict';

const fs = require('fs');
const path = require('path');
const router = require('express').Router();
const multer = require('multer');
const webtorrent = require('../controller/torrent');
const conf = require('../conf')

const {
    web3,
    account,
    transaction,
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


        var workerReward = fieldsObj['worker-reward'];


        var biddingDeadline = Math.floor(new Date().getTime() / 1000) + parseInt(fieldsObj['bidding-time'])
        var revealDeadline = biddingDeadline+30  // TODO Replace this

        // morphwareToken.methods.balanceOf('0x17Ae698Ed7Ed3994631b83311F39bc00Ef3C0aC7').call().then(console.log).catch(console.error)

        // morphwareToken.methods.transfer(
        //     '0x17Ae698Ed7Ed3994631b83311F39bc00Ef3C0aC7', web3.utils.toWei(workerReward.toString())
        // ).send().then(console.log).catch(console.error)


        let transfer = await morphwareToken.methods.transfer(
            conf.auctionFactoryContractAddress, web3.utils.toWei(workerReward.toString())
        ).send(
            {from: account.address, gas:"3000000"}
        );


        // let founds = await transaction(
        //     "3000000",
        //     conf.auctionFactoryContractAddress
        // );

        console.log('sent founds', transfer);


        let receipt = await jobFactoryContract.methods.postJobDescription(
            parseInt(fieldsObj['training-time']),
            parseInt(req.files['training-data'][0].size),
            parseInt(fieldsObj['error-rate']),
            parseInt(workerReward*.1),
            biddingDeadline,
            revealDeadline,
            workerReward
        ).send({from: account.address, gas:"3000000"})


        console.log('receipt', receipt)

        return res.json({status:'success'})


	    // TODO Call auctionEnd, this doesnt belong here.
	    var waitTimeInMS2 = ((revealDeadline - currentTimestamp) + safeDelay) * 1000;
	    console.log('Wait time before calling auctionEnd',(waitTimeInMS2/1000))

	    setTimeout(function(error,event){
	        try {
	            console.log('\nAbout to call auctionEnd()') // XXX
	            auctionFactory.methods.auctionEnd(
	                job.jobPoster,
	                parseInt(job.id)
	            ).send(
	                {gas:'3000000'}
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






        // TODO 8 Send a legitimate response
        res.send('success');



    }catch(error){
        next(error)
    }
});

module.exports = router;
