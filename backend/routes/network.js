'use strict';

const router = require('express').Router();
const {provider, web3} = require('../model/contract');

const netIDmap = {
	1: 'Mainnet',
	3: 'Ropsten'
}

router.get('/', async function(req, res, next){
	let netId = await web3.eth.net.getId();

	res.json({
		status: provider.connected,
		network: netIDmap[netId] ? netIDmap[netId] : netId
	});
});

module.exports = router;
