'use strict';

const Web3 = require('web3');
const BN = Web3.utils.BN;
const {conf} = require('../conf');

const provider = new Web3.providers.WebsocketProvider(conf.ethAddress, 
	{
	clientConfig:
		{
			maxReceivedFrameSize: 10000000,
			maxReceivedMessageSize: 10000000,
		} 
	}
);

const web3 = new Web3(provider);

function percentHelper(input, percent){
	return (new BN(input)).mul(new BN(percent)).div(new BN(100)).toString()
}

web3.currentProvider.on('connect', function(...args){console.log('connect', args, arguments)});
web3.currentProvider.on('disconnect', function(){console.log('disconnect', arguments)});
web3.currentProvider.on('error', function(){console.log('error', arguments)});
web3.currentProvider.on('block', function(){console.log('block', arguments)});
web3.currentProvider.on('start', function(){console.log('start', arguments)});


// const jobFactoryAbi = require(`./abi/${conf.jobFactoryAbiPath}`);
// const auctionFactoryAbi = require(`./abi/${conf.auctionFactoryABIPath}`);

// // Hold the web3 contracts
// const jobFactoryContract = new web3.eth.Contract(jobFactoryAbi, conf.jobFactoryContractAddress);
// const auctionFactoryContract = new web3.eth.Contract(auctionFactoryAbi,conf.auctionFactoryContractAddress);


module.exports = {web3, provider, percentHelper};
