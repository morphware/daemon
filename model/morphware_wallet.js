'use strict';

const conf = require('../conf');
const {web3, morphwareToken} = require('./contract');


class MorphwareWallet{
	constructor(privateKeyOrAccount){
		if(typeof(privateKeyOrAccount) === 'string'){
			this.account = web3.eth.accounts.privateKeyToAccount(privateKeyOrAccount)
		}else if(typeof(privateKeyOrAccount) === 'object' && privateKeyOrAccount.address){
			this.account = privateKeyOrAccount
		}else{
			throw 'Account or private key not provided.'
		}

		this.address = this.account.address;
		this.sign = this.account.sign;
		this.privateKey = this.account.privateKey;
		this.transactions = []

		this.getTransactionHistory();
	}

	static wallets = [];

	static add(privateKeyOrAccount){
		let wallet = new MorphwareWallet(privateKeyOrAccount);
		MorphwareWallet.wallets[wallet.address] = wallet;

		return wallet;
	}

	async getBalance(){
		return await morphwareToken.methods.balanceOf(this.address).call()
	}

	async send(address, amount, gas) {
		try{
			let transfer = morphwareToken.methods.transfer(
				address,
				web3.utils.toWei(amount.toString())
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

	async getTransactionHistory(){
		try{
			let logs = await web3.eth.getPastLogs({fromBlock:'0x0', address: conf.morphwareTokenContractAddress})

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
			console.log('get hist error', error)
			return false
		}
	}
}


morphwareToken.events.Transfer((error, event)=>{
	if(event.returnValues.to in MorphwareWallet.wallets){
		MorphwareWallet.wallets[event.returnValues.to].transactions.push(event);
	}

	if(event.returnValues.from in MorphwareWallet.wallets){
		MorphwareWallet.wallets[event.returnValues.from].transactions.push(event);
	}
});

module.exports = {MorphwareWallet};
