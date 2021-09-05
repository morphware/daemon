# API V0 Reference 

This is the documentation for the V0 API and is very much a work in progress.

## Contract
`api/v0/contract`
	Manages job contracts

	* GET **NOT IMPLEMENTED YET**
		Return current contracts

	* POST
		Start a new contract for a job 
		Fields:
		* `stop-training` STRING
		* `stop-training-automatic` STRING
		* `training-time` NUMBER
		* `error-rate` NUMBER
		* `bidding-time` NUMER
		* `worker-reward` NUMBER
		* `test-model` BOOL
		
		returns

	* PUT PATCH DELETE
		are not implemented, contracts can not be modified once submitted

## Network(ETH)
	Status about connection to an eth node

	* GET
		Returns if a connection exists

		Query **none*

		Fields
			* `status` BOOL connection to eth node

		Example

		``` bash
		curl 127.0.0.1:3000/api/V0/network
		{"status":true}
		
		```

	* To do
		Add endpoints to modify the current connection

## Torrents
	Torrents the client is currently interacting with

	* GET
		Return information from the torrent instance

		Query **none**

		Fields
			* `download` NUMBER The current download speed in bytes
			* `upload` NUMBER The current upload speed in bytes
			* `torrents` ARRAY List of current torrents

		Example

		```bash
		curl 127.0.0.1:3000/api/V0/torrent
		{"download":0,"upload":0,"torrents":[]}
		
		```

	* To do
		Add endpoints to interact with torrents


## Wallet **Coming soon!**
	View and send ETH and MWT associated with the current wallet

## Configuration **Coming soon!**
	View and manage runtime and persistent conf file
