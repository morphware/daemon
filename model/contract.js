'use strict';

const fs         = require('fs');
const path       = require('path');
const Web3       = require('web3');
const conf       = require('../conf');


const provider = new Web3.providers.WebsocketProvider(conf.ethAddress);
const web3 = new Web3(provider);

if(!conf.wallet || !conf.wallet.privateKey){
    console.log('Private key not found!!!')
    console.log('Please add this private key to your secrets.js file\n')
    console.log(web3.eth.accounts.create().privateKey)
    process.exit(1);
}else{
    var account = web3.eth.accounts.privateKeyToAccount(conf.wallet.privateKey)
    console.log(`Account found for ${account.address}`)
    web3.eth.accounts.wallet.add(account);
    web3.eth.defaultAccount = account.address
}

const jobFactoryAbiPathname = './abi/JobFactory-RopstenABI.json';
let jobFactoryAbi = JSON.parse(fs.readFileSync(path.resolve(jobFactoryAbiPathname),'utf-8'));
let jobFactoryContract = new web3.eth.Contract(jobFactoryAbi, conf.jobFactoryContractAddress, {from: account.address});


var auctionFactoryABIPathname = './abi/VickreyAuction-RopstenABI.json';
var auctionFactoryAbi = JSON.parse(fs.readFileSync(path.resolve(auctionFactoryABIPathname),'utf-8'));
var auctionFactory = new web3.eth.Contract(auctionFactoryAbi,conf.auctionFactoryContractAddress, {from: account.address});


var morphwareTokenABIPathname = './abi/MorphwareToken.json';
var morphwareTokenAbi = JSON.parse(fs.readFileSync(path.resolve(morphwareTokenABIPathname),'utf-8'));
const morphwareToken = new web3.eth.Contract(morphwareTokenAbi, conf.morphwareTokenContractAddress, {from: account.address});

// move this to wallet/account file


let onConect = [async function(){
    try{
        let res = await morphwareToken.methods.balanceOf(account.address).call()
        console.log('MWT balance', web3.utils.fromWei(res))
    }catch(error){
        console.error(error)
    }

}]



web3.currentProvider.on('connect', function(){
    for(let func of onConect){
        func();
    }
})
web3.currentProvider.on('disconnect', function(){console.log('disconnect', arguments)})
web3.currentProvider.on('error', function(){console.log('error', arguments)})
web3.currentProvider.on('block', function(){console.log('block', arguments)})
web3.currentProvider.on('start', function(){console.log('start', arguments)})



module.exports = {jobFactoryContract, morphwareToken, auctionFactory, web3, provider, account, onConect};