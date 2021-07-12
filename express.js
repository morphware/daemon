#!/usr/bin/env node
const fs         = require('fs');
const path       = require('path');
const bodyParser = require('body-parser');
const express    = require('express');
const multer     = require('multer');
const WebTorrent = require('webtorrent-hybrid');
const conf       = require('./conf');

const {jobFactoryContract, morphwareToken} = require('./model/contract');


///////////////////////////////////////////////////////////////////////////////
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './datalake/end_user/uploads');
    },
    // TODO 1 Create a key-value store that associates the original filename
    //        so it can be displayed in the dashboard and tracked by the user.
    filename: function (req, file, cb) {
        let ext = '';
        if (file.originalname.split('.').length > 1) {
            cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        }
    }
});

var upload = multer({storage:storage});
var validFields = upload.fields([
            {name:'jupyter-notebook',maxCount:1},
            {name:'training-data',maxCount:1},
            {name:'testing-data',maxCount:1}]);
///////////////////////////////////////////////////////////////////////////////

const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());


app.post('/upload', validFields, async function (req, res) {

    // TODO 9 Incorporate `fileFilter`

    ///////////////////////////////////////////////////////////////////////////////
    const fieldsObj = JSON.parse(req.body.fields);


    var biddingDeadline = Math.floor(new Date().getTime() / 1000) + parseInt(fieldsObj['bidding-time'])
    var revealDeadline = biddingDeadline+30  // TODO Replace this

    var workerReward = parseInt(fieldsObj['worker-reward']);

    morphwareToken.methods.transfer(
        conf.auctionFactoryContractAddress,workerReward
    ).send(
        {from:conf.account4Address, gas:"3000000"}
    );

    jobFactoryContract.methods.postJobDescription(
        parseInt(fieldsObj['training-time']),
        parseInt(req.files['training-data'][0].size),
        parseInt(fieldsObj['error-rate']),
        parseInt(workerReward*.1),
        biddingDeadline,
        revealDeadline,
        workerReward
    ).send(
        {from:conf.account4Address, gas:"3000000"}
    );

    var links = {};

    let count = 1; // FIXME Change this back to 3
    for (const [_fieldname, _fileArray] of Object.entries(req.files)) {
        let webtorrent = new WebTorrent();
        
        links[_fieldname] = webtorrent;

        let torrent = await webtorrent.seed(_fileArray[0].path)

        if (--count == 0) {
            await fs.writeFile("links.json", JSON.stringify({
                'jupyter-notebook': links['jupyter-notebook'].torrents[0].magnetURI,
                'training-data': links['training-data'].torrents[0].magnetURI,
                'testing-data':  links['testing-data'].torrents[0].magnetURI,
            }));
        }
    }
    res.send('success');
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

module.exports = app;