#!/usr/bin/env node
const fs         = require('fs');
const path       = require('path');
const bodyParser = require('body-parser');
const express    = require('express');
const multer     = require('multer');
const WebTorrent = require('webtorrent-hybrid');
const Web3       = require('web3');
// const sqlite3 = require('sqlite3').verbose();

// var db = new sqlite3.Database('./magnetLinks.db');



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
    var links = {};

    // db.serialize(function() {
    //     db.run("DROP TABLE IF EXISTS links; CREATE TABLE links (pk INTEGER PRIMARY KEY AUTOINCREMENT, user_address VARCHAR, job_id INTEGER, jupyter_notebook VARCHAR, training_data VARCHAR, testing_data VARCHAR)");


    let count = 1; // FIXME Change this back to 3
    for (const [_fieldname, _fileArray] of Object.entries(req.files)) {
        let f = _fileArray[0].path;

        let webtorrent = new WebTorrent();
        
        links[_fieldname] = webtorrent;

        webtorrent.seed(f, function (torrent) {
        // webtorrent.seed(f, async function (e, torrent) {
        // TODO 1
            if (--count == 0) {
                
                console.dir(links,{depth:5}) // Note: This works

                // console.dir(links.torrents[0].info.magnetURI,{depth:5}) // Check
                
                // console.log(links.torrents[0].info.magnetURI) // Check



                // TODO Search by key: use DevTools (Chrome)

                // var linksObj = JSON.stringify(links);
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
            // console.log(torrent);


            // console.log('\n',_fieldname);
        //   console.log(_fileArray[0].originalname);
        //   console.log(_fileArray[0].size);
            // console.log(torrent.magnetURI);



            // fieldName = _fieldname.replace(/-/g, '_');
            
            // var magnetLink = torrent.magnetURI;
            // console.log(magnetLink);

            // db.run("INSERT INTO links(user_address,job_id,jupyter_notebook,training_data,testing_data) VALUES (?,?,?,?,?)",
            //     [account4Address,,,,]);
        });
    }

    // });

    // db.close();



    // TODO 8 Send a legitimate response
    res.send('success');
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});