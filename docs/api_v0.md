# API V0 Reference 

This is the documentation for the V0 API and is very much a work in progress.

## Contract

`api/v0/contract`

Manages job contracts

* **GET** *NOT IMPLEMENTED YET*
	Return current contracts

* **POST**
	Start a new contract for a job 
	Post fields:
	* `stop-training` *STRING*
	* `stop-training-automatic` *STRING*
	* `training-time` *NUMBER*
	* `error-rate` *NUMBER*
	* `bidding-time` *NUMER*
	* `worker-reward` *NUMBER* Amount of MWT to be paid for a complete job.
	* `test-model` *BOOL*
	* `jupyter-notebook` *STRRING* Local path to the jupyter-notebook 
	* `training-data` *STRRING* Local path to the training-data 
	* `testing-data` *STRRING* Local path to the testing-data
		
	Exmaple
	
	Blocked by #15

* **PUT**, **PATCH**, **DELETE**
	
	Will not implemented, contracts can not be modified once submitted

## Network(ETH)

`/api/v0/network`

Status about connection to an eth node

* **GET**
	
	Returns if a connection exists

	Query **none**

	Resposne fields:
	* `status` *BOOL* connection to eth node

	Example

	``` bash
	curl 127.0.0.1:3000/api/V0/network
	{"status":true}
	```

* To do
  * Add endpoints to modify the current connection

## Torrents

`/api/v0/torrent`

Torrents the client is currently interacting with

* **GET**
	Return information from the torrent instance

	Query **none**

	Response fields:
	* `download` *NUMBER* The current download speed in bytes
	* `upload` *NUMBER* The current upload speed in bytes
	* `port` *NUMBER* The listening port for the torrent client
	* `torrents` *ARRAY* List of current torrents

	Example

	```bash
	curl 127.0.0.1:3000/api/V0/torrent
	{
	  "download": 0,
	  "upload": 0,
	  "port": 46049,
	  "torrents": [
	    {
	      "name": "jupyter-notebook.html",
	      "progress": 0,
	      "downloadSpeed": 0,
	      "numPeers": 0,
	      "timeRemaining": 0,
	      "magnetURI": "magnet:?xt=urn:btih:f35be570c19b5e026930e97a9533ac7207f960a4&dn=jupyter-notebook.html&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337"
	    },
	    {
	      "name": "training-data.html",
	      "progress": 0,
	      "downloadSpeed": 0,
	      "numPeers": 0,
	      "timeRemaining": 0,
	      "magnetURI": "magnet:?xt=urn:btih:7948a0c8a8407274fa5bc63219eaa061b495e5db&dn=training-data.html&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337"
	    },
	    {
	      "name": "testing-data.md",
	      "progress": 0,
	      "downloadSpeed": 0,
	      "numPeers": 0,
	      "timeRemaining": 0,
	      "magnetURI": "magnet:?xt=urn:btih:c38689c760a42c2f4060935ebfbf6e55d42350f9&dn=testing-data.md&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337"
	    }
	  ]
	}

	```

	* To do
		Add endpoints to interact with torrents


## Wallet

`/api/v0/wallet`

View and send MWT associated with the current wallet

* **GET**
	
	Returns the current MWT balance.

	Query **none**

	Resposne fields:
	* `balance` *STRING* Current address MWT balance as in wei.
	* `address` *STRING* Current Address.

	Example

	``` bash
	curl 127.0.0.1:3000/api/v0/wallet/
  {
  		"balance":"100000452999999999999899970",
  		"address":"0x5733592919406a356192bA957E7DFfb74fb62d1a"
  }
	```

* **GET** `wallet/history`
	
	Returns the transaction history for MWT.

	Query **none**

	Resposne fields:
	* `transactions` *ARRAY* List of transaction.
	* `address` *STRING* Current Address.

	Example

	``` bash
  curl 127.0.0.1:3000/api/v0/wallet/history
  {
  	"transactions":[
  		{"address":
  			"0xbc40E97E6d665CE77E784349293D716B030711bC",
  			"blockHash":"0x9bb1abc6d4979fe7c0b1e107b14934cb4ea6bf05ba6d8ae6dbafd041404057bf",
  			"blockNumber":10966492,
  			"data":"0x00000000000000000000000000000000000000000000003635c9adc5dea00000",
  			"logIndex":0,
  			"removed":false,
  			"topics":[
  				"0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
  				"0x0000000000000000000000008989a5c6aea7d677e61fa95e5824de7b7c74e38d",
  				"0x0000000000000000000000005733592919406a356192ba957e7dffb74fb62d1a"
  			],
  			"transactionHash":"0x3a4261ad350e6e006bd04a8dafc06ed97b8a58ee9b9367f58957bf90468e5696",
  			"transactionIndex":3,
  			"id":"log_5bb63534",
  			"returnValues":{
  					"0":"0x8989a5C6AEA7D677e61Fa95E5824De7B7C74e38d",
  					"1":"0x5733592919406a356192bA957E7DFfb74fb62d1a",
  					"2":"1000000000000000000000",
  					"__length__":3,
  					"from":"0x8989a5C6AEA7D677e61Fa95E5824De7B7C74e38d",
  					"to":"0x5733592919406a356192bA957E7DFfb74fb62d1a",
  					"value":"1000000000000000000000"
  			}
  		}
  	]
  }
	```

* **POST** `wallet/send`
	
	Transfers MWT from your address to a another address

	Query **none**
	Body fields:
	* `address` *STRING* **REQUIRED** The address you want to send coins too.
	* `amount` *STRING* **REQUIRED** The amount of MWT to send, in wei.
	* `gas` *STRING* The gas you would like to use.

	Resposne fields:
	* `transaction` *ARRAY* Returned transaction.

	Example

	``` bash
	curl -H "Content-Type: application/json" -X POST -d '{"address": "0x0cf9D6185AFc49027b9Daddbd2ec2aBf24f432e1", "amount":1000}' 127.0.0.1:3000/api/v0/wallet/send
  {
  	"transactions":{
  		"blockHash":"0x5e952ed704b2221df8ce52aea40835e00c972cfe3958a8756a7eda840916c486",
  		"blockNumber":11004136,
  		"contractAddress":null,
  		"cumulativeGasUsed":359989,
  		"effectiveGasPrice":"0x3b9aca08",
  		"from":"0x5733592919406a356192ba957e7dffb74fb62d1a",
  		"gasUsed":35353,
  		"logsBloom":"0x00100000004000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000100000000000100000000000000000000000010000000000004000000000000000000000400000000000008000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000",
  		"status":true,
  		"to":"0xbc40e97e6d665ce77e784349293d716b030711bc",
  		"transactionHash":"0x0728d303831dc5e00fe7b681d4a4bd44ab35e0920144b9e3279ed2dcbbb8c517",
  		"transactionIndex":7,
  		"type":"0x2",
  		"events":{
  			"Transfer":{
  				"address":"0xbc40E97E6d665CE77E784349293D716B030711bC",
  				"blockHash":"0x5e952ed704b2221df8ce52aea40835e00c972cfe3958a8756a7eda840916c486",
  				"blockNumber":11004136,
  				"logIndex":1,
  				"removed":false,
  				"transactionHash":"0x0728d303831dc5e00fe7b681d4a4bd44ab35e0920144b9e3279ed2dcbbb8c517",
  				"transactionIndex":7,
  				"id":"log_76330fd9",
  				"returnValues":{
  					"0":"0x5733592919406a356192bA957E7DFfb74fb62d1a",
  					"1":"0x0cf9D6185AFc49027b9Daddbd2ec2aBf24f432e1",
  					"2":"1000",
  					"from":"0x5733592919406a356192bA957E7DFfb74fb62d1a",
  					"to":"0x0cf9D6185AFc49027b9Daddbd2ec2aBf24f432e1",
  					"value":"1000"
  				},
  				"event":"Transfer",
  				"signature":"0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
  				"raw":{
  					"data":"0x00000000000000000000000000000000000000000000000000000000000003e8",
  					"topics":[
  					"0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
  					"0x0000000000000000000000005733592919406a356192ba957e7dffb74fb62d1a",
  					"0x0000000000000000000000000cf9d6185afc49027b9daddbd2ec2abf24f432e1"
  					]
  				}
  			}
  		}
  	}
  }

	```
## Configuration **Coming soon!**

`api/v0/conf`

View and manage runtime and persistent conf file
