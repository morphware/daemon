const fs         = require('fs');
const path       = require('path');
const WebTorrent = require('webtorrent-hybrid');
const Web3       = require('web3');

// 9 TODO Import dependency structure from one file

const webtorrent = new WebTorrent();

const provider = new Web3.providers.HttpProvider('http://localhost:8545');
let web3 = new Web3(provider);

const account4Address = '0xd03ea8624C8C5987235048901fB614fDcA89b117';

const jobFactoryContractAddress = '0xC89Ce4735882C9F0f0FE26686c53074E09B0D550';
const jobFactoryAbiPathname = './abi/JobFactory-copyABI.json';
let jobFactoryAbi = JSON.parse(fs.readFileSync(path.resolve(jobFactoryAbiPathname),'utf-8')).abi;
let jobFactoryContract = new web3.eth.Contract(jobFactoryAbi,jobFactoryContractAddress);

var auctionFactoryContractAddress = '0x254dffcd3277C0b1660F6d42EFbB754edaBAbC2B';
var auctionFactoryABIPathname = './abi/VickreyAuction-copyABI.json';
var auctionFactoryAbi = JSON.parse(fs.readFileSync(path.resolve(auctionFactoryABIPathname),'utf-8')).abi;



(async function procAuctionEnded(){
    // (B) This should stop listening for an event related to a job the worker has bid on,
    //     if was not the highest bidder.
    try {
        console.log('\nendUser node listening for AuctionEnded from AuctionFactory...') // XXX

        var auctionFactory = new web3.eth.Contract(auctionFactoryAbi,auctionFactoryContractAddress);

        await auctionFactory.events.AuctionEnded(
            { filter: { endUser: account4Address } }).on('data',
            function(event) {

                console.log('inside procAuctionEnded await'); // XXX
                
                var x = event.returnValues;
                // TODO May need to check the local disk space again, 
                //      because the training data may not fit if it
                //      changed.
                console.log(x);

                // FIXME Upload magnet links to smart contract




                

            }
        )
    } catch(error) {
        // TODO Handle error
        console.log(error)
    }
})()