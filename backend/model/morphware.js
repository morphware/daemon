'use strict';

const {conf, editLocalConf} = require('../conf');
const {web3} = require('./contract');
var wallet = null;

class MorphwareWallet{
	constructor(privateKeyOrAccount){
		if(typeof(privateKeyOrAccount) === 'string'){
			this.account = web3.eth.accounts.privateKeyToAccount(privateKeyOrAccount);
		}else if(typeof(privateKeyOrAccount) === 'object' && privateKeyOrAccount.address){
			// A web3 account isnt an instance of anything...
			this.account = privateKeyOrAccount;
		}else{
			throw 'Account or private key not provided.';
		}
		
		this.address = this.account.address;
		this.sign = this.account.sign;
		this.privateKey = this.account.privateKey;
		this.transactions = [];

		// Assign this wallets address to a contract do the contract can sign
		// transactions.
		this.contract = this.constructor.tokenContract.clone();
		this.contract.options.from = this.address;

		this.getTransactionHistory();
	}

	static tokenAbi = require(`./../abi/${conf.morphwareTokenABIPath}`);
	static tokenContract = new web3.eth.Contract(this.tokenAbi, conf.morphwareTokenContractAddress);
	static wallets = [];

	static add(privateKeyOrAccount){
		let wallet = new MorphwareWallet(privateKeyOrAccount);
		MorphwareWallet.wallets[wallet.address] = wallet;

		return wallet;
	}

	async getBalance(){
		return await this.contract.methods.balanceOf(this.address).call();
	}

	async send(address, amount, gas) {
		try{

			if(!web3.utils.isAddress(address)){
				throw 'Invalid address provided';
			}

			if(Number.isNaN(Number(amount))){
				throw 'Invalid amount provided';
			}

			let transfer = this.contract.methods.transfer(
				address,
				amount
			);

			return await transfer.send({
				from: this.address,
				gas: gas || await transfer.estimateGas()
			});
		}catch(error){
			console.error('ERROR!!!! `transaction`', error);
			throw error;
		}
	}

	async approve(amount){
		try{
			let action = this.contract.methods.approve(
				conf.auctionFactoryContractAddress,
				amount
			);

			let receipt = await action.send({
				gas: await action.estimateGas()
			});

			this.transactions.push(receipt);

			return receipt;
		}catch(error){
			console.error('ERROR!!!, MorphwareWallet approve', error, this);
		}
	}

	async getTransactionHistory(){
		try{
			let logs = await web3.eth.getPastLogs({
				fromBlock:'0x0',
				address: conf.morphwareTokenContractAddress
			});

			for(let log of logs){
				let data = `${log.topics[1]}${log.topics[2].replace('0x', '')}${log.data.replace('0x', '')}`
				let returnValues = web3.eth.abi.decodeLog([
					{ internalType: 'address', name: 'from', type: 'address' },
					{ internalType: 'address', name: 'to', type: 'address' },
					{ internalType: 'uint256', name: 'value', type: 'uint256' }
				], data);

				if([returnValues.to, returnValues.from].includes(this.address)){
					this.transactions.push({...log, returnValues});
				}
			}

			return true;

		}catch(error){
			console.log('Transaction history error, please report this', error);
			return false
		}
	}
}


// Listen for transfer events to keep the tracked wallets transactions history
// fresh.
MorphwareWallet.tokenContract.events.Transfer((error, event)=>{
	if(error){
		console.error('Error `MorphwareWallet.tokenContract.events.Transfer` from event', error);
		return ;
	}
	try{
		if(event.returnValues.to in MorphwareWallet.wallets){
			MorphwareWallet.wallets[event.returnValues.to].transactions.push(event);
		}

		if(event.returnValues.from in MorphwareWallet.wallets){
			MorphwareWallet.wallets[event.returnValues.from].transactions.push(event);
		}		
	}catch(error){
		console.error("Error `MorphwareWallet.tokenContract.events.Transfer`", error, event);
	}
});


// Set up the default wallet and use it as the default.
if(conf.privateKey && conf.privateKey.length){
	let account = web3.eth.accounts.privateKeyToAccount(conf.privateKey[0]);
	console.info(`Account found for ${account.address}`);
	web3.eth.accounts.wallet.add(account);
	web3.eth.defaultAccount = account.address;
	wallet = MorphwareWallet.add(account);

// If no private key is found, make a new one
}else{
	console.log('Adding address on first app run...');
	let account = web3.eth.accounts.create();
	console.info(`Making account with address ${account.address}`);
	web3.eth.accounts.wallet.add(account);
	web3.eth.defaultAccount = account.address;
	wallet = MorphwareWallet.add(account);

	// Save the new account to the local settings file
	editLocalConf({
		privateKey: [account.privateKey]
	})
}

module.exports = {MorphwareWallet, wallet};
