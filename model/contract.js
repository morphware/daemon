'use strict';
const fs         = require('fs');
const path       = require('path');
const Web3       = require('web3');
const conf       = require('./../conf');

const provider = new Web3.providers.WebsocketProvider('wss://ropsten.infura.io/ws/v3/dc53ba9a23564600bfbe5f8c2f345d1d');
const web3 = new Web3(provider);

const account = web3.eth.accounts.privateKeyToAccount(conf.wallet.privatekey)
web3.eth.defaultAccount = account.address
console.log(account);

const jobFactoryAbiPathname = './abi/JobFactory-RopstenABI.json';
let jobFactoryAbi = JSON.parse(fs.readFileSync(path.resolve(jobFactoryAbiPathname),'utf-8')).abi;
let jobFactoryContract = new web3.eth.Contract(jobFactoryAbi, conf.jobFactoryContractAddress);


var auctionFactoryABIPathname = './abi/VickreyAuction-RopstenABI.json';
var auctionFactoryAbi = JSON.parse(fs.readFileSync(path.resolve(auctionFactoryABIPathname),'utf-8')).abi;
var auctionFactory = new web3.eth.Contract(auctionFactoryAbi,conf.auctionFactoryContractAddress);


var morphwareTokenABIPathname = './abi/MorphwareToken-RopstenABI.json';
var morphwareTokenAbi = JSON.parse(fs.readFileSync(path.resolve(morphwareTokenABIPathname),'utf-8')).abi;
const morphwareToken = new web3.eth.Contract(morphwareTokenAbi, conf.morphwareTokenContractAddress);

module.exports = {jobFactoryContract, morphwareToken, auctionFactory, web3, provider, account};


provider.on('connection', console.log)
provider.on('error', console.log)



