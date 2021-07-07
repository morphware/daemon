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
const account4Address = '0xd03ea8624C8C5987235048901fB614fDcA89b117';

const jobFactoryContractAddress = '0xC89Ce4735882C9F0f0FE26686c53074E09B0D550';
const jobFactoryAbiPathname = './abi/JobFactory-copyABI.json';
let jobFactoryAbi = JSON.parse(fs.readFileSync(path.resolve(jobFactoryAbiPathname),'utf-8')).abi;
let jobFactoryContract = new web3.eth.Contract(jobFactoryAbi,jobFactoryContractAddress);

var auctionFactoryContractAddress = '0x254dffcd3277C0b1660F6d42EFbB754edaBAbC2B';
var auctionFactoryABIPathname = './abi/VickreyAuction-copyABI.json';
var auctionFactoryAbi = JSON.parse(fs.readFileSync(path.resolve(auctionFactoryABIPathname),'utf-8')).abi;

var morphwareTokenABIPathname = './abi/MorphwareToken-copyABI.json';
var morphwareTokenAbi = JSON.parse(fs.readFileSync(path.resolve(morphwareTokenABIPathname),'utf-8')).abi;
var morphwareTokenContractAddress = '0xCfEB869F69431e42cdB54A4F4f105C19C080A601';
var morphwareToken = new web3.eth.Contract(morphwareTokenAbi,morphwareTokenContractAddress);

var links = {};

///////////////////////////////////////////////////////////////////////////////

app.post('/upload', validFields, async function (req, res) {

    // TODO 9 Incorporate `fileFilter`

    ///////////////////////////////////////////////////////////////////////////////
    const fieldsObj = JSON.parse(req.body.fields);

    var biddingDeadline = Math.floor(new Date().getTime() / 1000) + parseInt(fieldsObj['bidding-time'])
    var revealDeadline = biddingDeadline+30  // TODO Replace this

    var workerReward = parseInt(fieldsObj['worker-reward']);

    morphwareToken.methods.transfer(
        auctionFactoryContractAddress,workerReward
    ).send(
        {from:account4Address, gas:"3000000"}
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
        {from:account4Address, gas:"3000000"}
    );

    // TODO return next(error);

    ///////////////////////////////////////////////////////////////////////////////
    for (const [_fieldname, _fileArray] of Object.entries(req.files)) {
        let f = _fileArray[0].path;
        webtorrent.seed(f, function (torrent) {
        // TODO 1
        //   console.log(_fieldname);
        //   console.log(_fileArray[0].originalname);
        //   console.log(_fileArray[0].size);
        //   console.log(torrent.magnetURI);
            links[_fieldname] = torrent.magnetURI;
        });
    }

    var linksObj = JSON.stringify(links);

    // TODO 9 Replace links with a more descriptive filename
    fs.writeFile("links.json", linksObj, function(err, result) {
        if(err) console.log('error', err);
    });


    // TODO 8 Send a legitimate response
    res.send('success');
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});