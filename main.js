#!/usr/bin/env node
const fs         = require('fs');
const path       = require('path');
const bodyParser = require('body-parser');
const express    = require('express');
const multer     = require('multer');
const WebTorrent = require('webtorrent-hybrid');
const Web3       = require('web3');

///////////////////////////////////////////////////////////////////////////////
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'datalake/uploads');
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

const webtorrent = new WebTorrent();

///////////////////////////////////////////////////////////////////////////////
const provider = new Web3.providers.HttpProvider('http://localhost:8545');
let web3 = new Web3(provider);

// TODO Un-hardcode these three
const jobFactoryContractAddress = '0xC89Ce4735882C9F0f0FE26686c53074E09B0D550';
const account4Address = '0xd03ea8624C8C5987235048901fB614fDcA89b117';
const abiPathname = 'JobFactory-copyABI.json';

let jobFactoryAbi = JSON.parse(fs.readFileSync(path.resolve(abiPathname),'utf-8')).abi;
let jobFactoryContract = new web3.eth.Contract(jobFactoryAbi,jobFactoryContractAddress);

///////////////////////////////////////////////////////////////////////////////

app.post('/upload', validFields, async function (req, res) {

    // TODO Incorporate `fileFilter`

    ///////////////////////////////////////////////////////////////////////////////
    const fieldsObj = JSON.parse(req.body.fields);

    jobFactoryContract.methods.postJobDescription(
        parseInt(fieldsObj['training-time']),
        parseInt(req.files['training-data'][0].size),
        parseInt(fieldsObj['error-rate']),
        parseInt(Number(fieldsObj['worker-reward'])*.1),
        parseInt(fieldsObj['bidding-time']),
        parseInt(Number(fieldsObj['bidding-time'])),
        parseInt(fieldsObj['worker-reward'])
    ).send(
        {from:account4Address, gas:"3000000"}
    );

    // TODO return next(error);

    ///////////////////////////////////////////////////////////////////////////////
    for (const [_fieldname, _fileArray] of Object.entries(req.files)) {
        let f = _fileArray[0].path;
        webtorrent.seed(f, function (torrent) {
    // TODO 1
    //         console.log(_fieldname)
    //         console.log(_fileArray[0].originalname)
    //         console.log(_fileArray[0].size)
            console.log(torrent.magnetURI);
        });
    }

    // TODO 9 Send a legitimate response
    res.send('success');
});


app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});