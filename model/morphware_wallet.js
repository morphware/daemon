'use strict';

const contract = require('./contract');

class MorphwareWallet{
	constructor(address){
		this.address = address
	}

	async getBalance(){
		return await contract.morphwareToken.methods.balanceOf(con.account.address).call()
	}

	async transaction(data, gas) {
	    try{
	        let signPromise = await account.signTransaction({
	            from: account.address,
	            gas,
	            data
	        });
	        
	        return await web3.eth.sendSignedTransaction(signPromise.rawTransaction);   
	    }catch(error){
	        console.error('ERROR!!!! `transaction`', error);
	        throw error;
	    }
	}


}

module.exports = {MorphwareWallet};



out = await web3.eth.getPastLogs({fromBlock:'0x0',address:conaddy})
for(let i of out){
	await web3.eth.getTransaction(i.transactionHash)
}


async function checkBlock(address) {
    let block = await web3.eth.getBlock('latest');
    let number = block.number;
    let transactions = block.transactions;
    //console.log('Search Block: ' + transactions);

    if (block != null && block.transactions != null) {
        for (let txHash of block.transactions) {
            let tx = await web3.eth.getTransaction(txHash);
            if (address == tx.to.toLowerCase()) {
                console.log("from: " + tx.from.toLowerCase() + " to: " + tx.to.toLowerCase() + " value: " + tx.value);
            }
        }
    }
}


 var transactionChecker = new  TransactionChecker('0x69fb2a80542721682bfe8daa8fee847cddd1a267');
 transactionChecker.checkBlock();
