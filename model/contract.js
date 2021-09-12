'use strict';

const fs         = require('fs');
const path       = require('path');
const Web3       = require('web3');
const conf       = require('../conf');


const provider = new Web3.providers.WebsocketProvider(conf.ethAddress);
const web3 = new Web3(provider);


const jobFactoryAbiPathname = './abi/JobFactory-RopstenABI.json';
let jobFactoryAbi = JSON.parse(fs.readFileSync(path.resolve(jobFactoryAbiPathname),'utf-8'));
let jobFactoryContract = new web3.eth.Contract(jobFactoryAbi, conf.jobFactoryContractAddress,);


var auctionFactoryABIPathname = './abi/VickreyAuction-RopstenABI.json';
var auctionFactoryAbi = JSON.parse(fs.readFileSync(path.resolve(auctionFactoryABIPathname),'utf-8'));
var auctionFactory = new web3.eth.Contract(auctionFactoryAbi,conf.auctionFactoryContractAddress,);


web3.currentProvider.on('connect', function(...args){console.log('connect', args, arguments)});
web3.currentProvider.on('disconnect', function(){console.log('disconnect', arguments)})
web3.currentProvider.on('error', function(){console.log('error', arguments)})
web3.currentProvider.on('block', function(){console.log('block', arguments)})
web3.currentProvider.on('start', function(){console.log('start', arguments)})



module.exports = {jobFactoryContract, auctionFactory, web3, provider };