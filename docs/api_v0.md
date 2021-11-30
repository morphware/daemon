# API V0 Reference 

This is the documentation for the V0 API and is very much a work in progress.

## Jobs

`api/v0/job`

Manages job contracts

* **GET** `api/v0/job`
	Return all current contracts being tracked

	Query **none**

	Response fields:
	* `canTakeWork` *BOOL* If the current client is taking new work, This is not
		the same as `acceptingWork`, a worker currently involved in a contract will
		report false.
	* `jobs` *OBJECT* All the jobs the client is currently involved in.
	  * `instanceID` *STRING* Unique ID to track job instances
	  * `id` *STRING* Auction/jd ID for the job
	  * `type` *STRING* states if this job is a poster, worker or validator
	  * `wallet` *STRING* Wallet address of this node attached to this job
	  * `jobData` *OBJECT* Data about the job returned by the contract
			* `auctionAddress` *STRING* Address of the smart contract
			* `biddingDeadling` *STRING* Timestamp for when the bidding will end
			* `revealDeadline` *STRING* Timestamp for when the auction is completed
			* `estimatedTrainingTime` *STRING* Time it will take the job to run
			* `id` *STRING* Job/Auction ID
			* `jobPoster` *STRING* wallet address of the job poster
			* `trainingDatasetSize` *STRING* size in bytes of the training data size
			* `workerReward` *STRING* Max payout in MWT WEI for this contract
		* `postData` *OBJECT* Data posted to create this job, see this sections
		  **POST** for more information. Only poster clients will have this.
		* `status` *STRING* Current state of the job life cycle
		* `transactions` *ARRAY* List of transactions history for this job

	Example

	[Poster](api_poster.json)

	[Worker](api_worker.json)

* **GET** `api/v0/job/<instanceID>`
		Return data for the passed instance ID

		Query **none**

		Response fields:
		See above `job` field


* **GET** `api/v0/job/stream`
		Shows the last 50 events 

		Query **none**

		Response fields:
		* 'stream' *ARRAY* Array of events, see above for event contents


* **POST**
	Start a new contract for a job 
	Post fields:
	* `stopTraining` *STRING*
	* `stopTrainingAutomatic` *STRING*
	* `trainingTime` *NUMBER*
	* `errorTate` *NUMBER*
	* `biddingTime` *NUMER*
	* `workerReward` *NUMBER* Amount of MWT to be paid for a complete job.
	* `testModel` *BOOL*
	* `jupyterNotebook` *STRRING* Local path to the jupyter-notebook 
	* `trainingData` *STRRING* Local path to the training-data 
	* `testingData` *STRRING* Local path to the testing-data

		Response fields:
	* `status` *STRING* "Success" for job created 
	* `job` *STRING* The jobs instance ID, use this look up the job

		
	Example
	
	```bash
	curl 'http://127.0.0.1:3001/api/v0/contract' \
  -H 'Content-Type: application/json' \
  --data-raw '{"jupyterNotebook":"/home/william/dev/morphware/daemon/devRun.js","trainingData":"/home/william/dev/morphware/daemon/README.md","testingData":"/home/william/dev/morphware/daemon/build.js","stopTraining":"active_monitoring","stopTrainingAutomatic":"threshold_value","trainingTime":"60","biddingTime":"60","errorRate":"60","workerReward":"1000000000000000000","testModel":true}'
	{"status":"success","job":"0xF85CeEB0b76B74205caa2E1a72cDc085bC6eB9BB:9"}
	
	```

* **PUT**, **PATCH**, **DELETE**
	
	Will not implemented, contracts can not be modified once submitted





## Network(ETH)

`/api/v0/network`

Status about connection to an eth node

* **GET**
	
	Returns if a connection exists

	Query **none**

	Response fields:
	* `status` *BOOL* connection to eth node
	* `network` *STRING* which network it's connected to

	Example

	``` bash
	curl 127.0.0.1:3001/api/V0/network
	{"status":true,"network":"Mainnet"}
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
	curl 127.0.0.1:3001/api/V0/torrent
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

* **GET** `/api/v0/wallet`
	
	Returns the current MWT balance.

	Query **none**

	Response fields:
	* `balance` *STRING* Current address MWT balance as in wei.
	* `address` *STRING* Current Address.

	Example

	``` bash
	curl 127.0.0.1:3001/api/v0/wallet/
  {
  		"balance":"100000452999999999999899970",
  		"address":"0x5733592919406a356192bA957E7DFfb74fb62d1a"
  }
	```

* **GET** `wallet/history`
	
	Returns the transaction history for MWT.

	Query **none**

	Response fields:
	* `transactions` *ARRAY* List of transaction.
	* `address` *STRING* Current Address.

	Example

	``` bash
  curl 127.0.0.1:3001/api/v0/wallet/history
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

	Response fields:
	* `transaction` *ARRAY* Returned transaction.

	Example

	``` bash
	curl -H "Content-Type: application/json" -X POST -d '{"address": "0x0cf9D6185AFc49027b9Daddbd2ec2aBf24f432e1", "amount":1000}' 127.0.0.1:3001/api/v0/wallet/send
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



* **GET** `wallet/price`

	Gets the current price of MWT to USD
	NOTE: At the moment this is hardcoded to 0.1, but will be updated to use the MWT price feed oracle when its live.

	Query **none**

	Response fields:
	* `price` *string* MWT price in USD.
	
	Example

	``` bash
	curl 127.0.0.1:3010/api/v0/wallet/price
	{
		"price":0.1
	}
## Settings 

`api/v0/settings`

View and edit settings

* **GET**
	
	Returns the current settings and what keys can be edited

	Query **none**

	Response fields:
	* `conf` *OBJEECT* Current configuration object.
	* `editKeys` *Object* What keys can be edited.
		* `key` *STRING* The key name
		* `type` *STRING* The type the key can take.

	Example

	```bash

		{
	  "conf": {
	    "httpAddress": "127.0.0.1",
	    "httpPort": 3099,
	    "appName": "MorphwareWallet",
	    "morphwareTokenABIPath": "MorphwareToken-RopstenABI",
	    "morphwareTokenContractAddress": "0xbc40e97e6d665ce77e784349293d716b030711bc",
	    "auctionFactoryABIPath": "VickreyAuction-RopstenABI",
	    "auctionFactoryContractAddress": "0x0f96cf29c8d9f65f83e6992cad3ebbe9a395f332",
	    "jobFactoryAbiPath": "JobFactory-RopstenABI",
	    "jobFactoryContractAddress": "0xb2da7fcc212fe1c747048d7c7caca6a2bd8ec0bc",
	    "ethAddress": "wss://ropsten.infura.io/ws/v3/dc53ba9a23564600bfbe5f8c2f345d1d",
	    "electronDev": true,
	    "privateKey": [
	      "0x6644308f8abe578c3598f9749c52e"
	    ],
		"jupyterLabPort":3040,
	    "h": 3099,
	    "version": "0.0.11",
	    "appDataPath": "/home/william/.local/share/MorphwareWallet-development/",
	    "appDataLocal": "/home/william/.local/share/MorphwareWallet-development/local.json",
	    "environment": "development"
	  },
	  "editKeys": {
	    "httpBindAddress": {
	      "type": "string"
	    },
	    "httpPort": {
	      "type": "number"
	    },
	    "privateKey": {
	      "type": "array"
	    },
	    "torrentListenPort": {
	      "type": "number"
	    },
	    "appDownloadPath": {
	      "type": "string"
	    },
		"jupyterLabPort": {
			"type":"number"
		},
		"miningCommand": {
			"type":"string"
		},
		"workerGPU": {
			"type":"string"
		},
		"role": {
			"type":"string"
		},
	  }
	}
	```

* **POST** `settings/`

	Post the new local settings to the client. **THE CHANGES WILL NOT TAKE EFFECT
	UNTIL THE CLIENT IS RESTARTED**

	Query **none**
	Body fields:
		See `editKeys` from *GET*

	Response fields:
		The response will be the new local settings object

	Example
	```bash
	curl  -H "Content-Type: application/json" -X POST -d '{"privateKey":["0x66443098f9749c52e"]}' 127.0.0.1:3099/api/v0/settings
	{"privateKey":["0x66443098f9749c52e"]}
	```

	Example Error
	```bash
	curl  -H "Content-Type: application/json" -X POST -d '{"privateKeys":["0x66443098f9749c52e"]}' 127.0.0.1:3099/api/v0/settings
  {"error":"Can not edit privateKeys"}
	```
* **GET** `settings/role`

	Get the role of the user. i.e. Poster, Worker or Validator

	Example
	```bash
	curl 127.0.0.1:3010/api/v0/settings/role
	{"role":"validator"}
	```
## Notebook

'api/v0/notebook/start'

* **POST**

	Start a Jupyter Lab on the port set on the settings screen. Default is 3020

	Query **none**

	Response fields:
	* `status` 'success'

	Example

	``` bash
		curl -X POST 127.0.0.1:3008/api/v0/notebook/start
		{"status":"success"}
	```

'api/v0/notebook/stop'

* **POST**

	Stop a Jupyter Lab in the port set on the settings screen. Default is 3020

	Query **none**

	Response fields:
	* `status` 'success'

	Example

	``` bash
		curl -X POST 127.0.0.1:3008/api/v0/notebook/stop
		{"status":"success"}
	```
## Mining

'api/v0/miner/start'

* **POST**

	Start a mining process group using the global mining command configured in the settings

	Query **none**

	Response fields:
	* `status` 'success'

	Example

	``` bash
		curl -X POST 127.0.0.1:3008/api/v0/miner/start
		{"status":"success"}
	```

'api/v0/miner/stop'

* **POST**

	Stop the mining process group if currently running

	Query **none**

	Response fields:
	* `status` 'success'

	Example

	``` bash
		curl -X POST 127.0.0.1:3008/api/v0/miner/stop
		{"status":"success"}
	```




