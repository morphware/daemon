'use strict';

const fs         = require('fs');
const path       = require('path');
const Web3       = require('web3');
const conf       = require('../conf');
const HDWalletProvider    = require('@truffle/hdwallet-provider');



const wsProvider = new Web3.providers.WebsocketProvider(conf.ethAddress)
HDWalletProvider.prototype.on = wsProvider.on.bind(wsProvider)


// const provider = new Web3.providers.WebsocketProvider(conf.ethAddress);
const provider = new HDWalletProvider({
    privateKeys: [conf.wallet.privateKey]   ,
    providerOrUrl: wsProvider
});
const web3 = new Web3(provider);






const account = web3.eth.accounts.privateKeyToAccount(conf.wallet.privateKey)
web3.eth.defaultAccount = account.address
console.log(account);

const jobFactoryAbiPathname = './abi/JobFactory-RopstenABI.json';
let jobFactoryAbi = JSON.parse(fs.readFileSync(path.resolve(jobFactoryAbiPathname),'utf-8')).abi;
let jobFactoryContract = new web3.eth.Contract(jobFactoryAbi, conf.jobFactoryContractAddress);


var auctionFactoryABIPathname = './abi/VickreyAuction-RopstenABI.json';
var auctionFactoryAbi = JSON.parse(fs.readFileSync(path.resolve(auctionFactoryABIPathname),'utf-8')).abi;
var auctionFactory = new web3.eth.Contract(auctionFactoryAbi,conf.auctionFactoryContractAddress);


var morphwareTokenABIPathname = './abi/MorphwareToken.json';
var morphwareTokenAbi = JSON.parse(fs.readFileSync(path.resolve(morphwareTokenABIPathname),'utf-8'));
const morphwareToken = new web3.eth.Contract(morphwareTokenAbi, conf.morphwareTokenContractAddress, {from: account.address});

// move this to wallet/account file


async function transaction(data, gas) {
    try{

        


        let tx = await web3.eth.accounts.signTransaction({
            data, gas
        }, conf.wallet.privateKey);

        console.log('signTransaction', tx)

        return await web3.eth.sendSignedTransaction(tx.rawTransaction)



        // console.log('in transaction', signPromise)

        // return await web3.eth.sendSignedTransaction(signPromise.rawTransaction);   
    }catch(error){
        console.error('ERROR!!!! `transaction`', error);
        throw error;
    }
}

let onConect = []



provider.on('connect', function(){
    console.log('stuff')
    for(let func of onConect){
        func();
    }
})
provider.on('error', function(){console.log('error', arguments)})
provider.on('block', function(){console.log('block', arguments)})
provider.on('start', function(){console.log('start', arguments)})



module.exports = {jobFactoryContract, morphwareToken, auctionFactory, web3, provider, account, transaction, onConect};