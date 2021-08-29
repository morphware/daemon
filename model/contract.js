'use strict';
const fs         = require('fs');
const path       = require('path');
const Web3       = require('web3');
const conf       = require('./../conf');

const provider = new Web3.providers.WebsocketProvider('ws://localhost:8545');
const web3 = new Web3(provider);

const jobFactoryAbiPathname = './abi/JobFactory-copyABI.json';
let jobFactoryAbi = JSON.parse(fs.readFileSync(path.resolve(jobFactoryAbiPathname),'utf-8')).abi;
let jobFactoryContract = new web3.eth.Contract(jobFactoryAbi, conf.jobFactoryContractAddress);


var auctionFactoryABIPathname = './abi/VickreyAuction-copyABI.json';
var auctionFactoryAbi = JSON.parse(fs.readFileSync(path.resolve(auctionFactoryABIPathname),'utf-8')).abi;
var auctionFactory = new web3.eth.Contract(auctionFactoryAbi,conf.auctionFactoryContractAddress);


var morphwareTokenABIPathname = './abi/MorphwareToken-copyABI.json';
var morphwareTokenAbi = JSON.parse(fs.readFileSync(path.resolve(morphwareTokenABIPathname),'utf-8')).abi;
const morphwareToken = new web3.eth.Contract(morphwareTokenAbi, conf.morphwareTokenContractAddress);

module.exports = {jobFactoryContract, morphwareToken, auctionFactory, web3, provider};
