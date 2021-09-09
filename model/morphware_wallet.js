'use strict';

const conf = require('../conf');
const {
    web3,
    account,
    transaction,
    jobFactoryContract,
    auctionFactory,
    morphwareToken,
} = require('./contract');



class MorphwareWallet{
	constructor(privateKeyOrAccount){
		if(typeof(privateKeyOrAccount) === 'string'){
    		this.account = web3.eth.accounts.privateKeyToAccount(privateKeyOrAccount)
		}else if(typeof(privateKeyOrAccount) === 'object' && privateKeyOrAccount.address){
			this.account = privateKeyOrAccount
		}else{
			throw 'Account or private key not provided.'
		}
	}

	async getBalance(){
		return await morphwareToken.methods.balanceOf(this.account.address).call()
	}

	async send(address, gas) {
	    try{
			return await morphwareToken.methods.transfer(
	            address,
	            web3.utils.toWei(workerReward.toString())
	        ).send(
	            {from: this.account.address, gas:"3000000"}
	        );
	    }catch(error){
	        console.error('ERROR!!!! `transaction`', error);
	        throw error;
	    }
	}

	async getTransactionHistory(){
		try{
			let out = [];

			let transactions = await web3.eth.getPastLogs({
				fromBlock:'0x0', address: conf.morphwareTokenContractAddress
			})

			for(let transaction of transactions){
				transaction = await web3.eth.getTransaction(transaction.transactionHash)
				console.log(transaction, 'asdasd', [transaction.to, transaction.from])
				// morphwareToken._jsonInterface[14], where 'signature' = '0xa9059cbb'
				if([transaction.to, transaction.from].includes(this.account.address)){
					let data = web3.eth.abi.decodeLog([
		    			{ internalType: 'address', name: 'recipient', type: 'address' },
		    			{ internalType: 'uint256', name: 'amount', type: 'uint256' }
		  			], transaction.input.replace('0xa9059cbb', '0x'));

					out.push({...transaction, MwtValue: data.account });

				}


			}

			return out;

		}catch(error){

			return []
		}
	}
}


module.exports = {MorphwareWallet};
