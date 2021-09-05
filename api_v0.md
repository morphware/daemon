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


## Wallet **Coming soon!**

`/api/v0/wallet`

View and send ETH and MWT associated with the current wallet

## Configuration **Coming soon!**

`api/v0/conf`

View and manage runtime and persistent conf file
