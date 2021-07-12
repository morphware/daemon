'use strict';

const fs         = require('fs');
const path       = require('path');
const Web3       = require('web3');
const { URL }    = require('url');
const {jobFactoryContract, auctionFactory} = require('./model/contract');
const conf       = require('./conf');

auctionFactory.events.AuctionEnded(
    { filter: { endUser: conf.account4Address } },
    function(error, event) {
        if(error){
            console.error('enduser auctionFactory error', error);
            throw(error);
        }

        console.log('arg', arguments)
        console.log(event);
        console.log('Inside procAuctionEnded await...'); // XXX


        var contractData = event.returnValues;
        // TODO May need to check the local disk space again, 
        //      because the training data may not fit if it
        //      changed.
        console.log(contractData);

        var magnetLinks = JSON.parse(fs.readFileSync('./links.json','utf-8'));;
        

        // TEST
        console.log(magnetLinks) // XXX


        // TEST
        console.log(typeof(magnetLinks['jupyter-notebook'])) // XXX
        console.log(typeof(magnetLinks['training-data'])) // XXX
        console.log(magnetLinks['jupyter-notebook']) // XXX
        console.log(magnetLinks['training-data']) // XXX

        // Note: `x.endUser` is the same as `conf.account4Address`
        jobFactoryContract.methods.shareUntrainedModelAndTrainingDataset(
            conf.account4Address,
            contractData.auctionId,
            magnetLinks['jupyter-notebook'],
            magnetLinks['training-data']
        ).send(
            {from:conf.account4Address, gas:'3000000'}
        ).on('receipt', async function(receipt) {
            try{
                console.log('\nShared untrained model and training dataset...\n'); // XXX
                console.log(receipt); // XXX

            }catch(error){
                console.error(error);

            }
        })
    }
);
