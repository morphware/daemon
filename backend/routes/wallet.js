'use strict';

const router = require('express').Router();
const {wallet} = require('../model/morphware');

router.get('/', async function(req, res, next){
	try{
		return res.json({
			balance: await wallet.getBalance(),
			address: wallet.address
		});
	}catch(error){
		next(error);
	}
});

router.get('/history', async function(req, res, next) {
	try{
		return res.json({
			transactions: wallet.transactions,
			address: wallet.address
		});
	}catch(error){
		next(error);
	}
});

router.post('/send', async function(req, res, next){
	try{
		return res.json({
			transactions: await wallet.send(req.body.address, req.body.amount, req.body.gas)
		});
	}catch(error){
		next(error);
	}
});

router.post('/sign', async function(req, res, next){
	try{
		if(!req.body.message){
			throw 'Message is messing';
		}

		return res.json(wallet.sign(req.body.message));
	}catch(error){
		next(error);
	}
});

module.exports = router;
