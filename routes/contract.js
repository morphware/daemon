'use strict';

const router = require('express').Router();
const multer = require('multer');

const {jobFactoryContract, morphwareToken} = require('./model/contract');


// TODO Un-hardcode this
const account4Address = '0xd03ea8624C8C5987235048901fB614fDcA89b117';

///////////////////////////////////////////////////////////////////////////////
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        ///////////////////////
        // TODO Unhardcode the following jobId (i.e., `0`):
        var uploadsDir   = `./datalake/end_user/uploads/${account4Address}/0`;
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

app.post('/upload', validFields, async function (req, res) {

    // TEST
    console.log(req); // XXX

    // TODO 9 Incorporate `fileFilter`

    ///////////////////////////////////////////////////////////////////////////////
    const fieldsObj = JSON.parse(req.body.fields);

    // TEST
    console.log(fieldsObj); // XXX

    ///////////////////////////////////////////////////////////////////////////////
    // `nbconvert`
    
    // var untrainedModelFile = req.files['jupyter-notebook'][0];
    // console.log('untrainedModelFile:',untrainedModelFile);

    // if (path.extname(untrainedModelFile.originalname) == `.ipynb`) {
    //     console.log('Converting Jupyter notebook...')
    //     // FIXME
    //             // TODO Unhardcode the following jobId (i.e., `0`), and wallet address:
    //     var untrainedModelPath = `./datalake/end_user/uploads/${account4Address}/0`
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


    let count = 0; // FIXME Change this back to 3
    for (const [_fieldname, _fileArray] of Object.entries(req.files)) {
        let f = _fileArray[0].path;

        let webtorrent = new WebTorrent();
        
        links[_fieldname] = webtorrent;

        webtorrent.seed(f, function (torrent) {
        // webtorrent.seed(f, async function (e, torrent) {
        // TODO 1
            if (--count == 0) {
                
                // console.dir(links,{depth:5}) // Note: This works

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