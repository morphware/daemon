# Configuration

The configuration is split into 3, over ridding JS files.

First `base.js` is loaded. After that `production.js` or `development.js` is
loaded based on current runtime environment. This is defined by
`process.env.NODE_ENV`. Lastly `secrets.js` is loaded. `secrets.js` is not
tracked by git and is a suitable place for any local or private configurations.
Each time a file is load, its over layed onto the conf object. A environment or
`secrets.js` is not required to start the project, but `base.js` is

Any valid Java Script can be placed in each conf file. `module.exports` must
export a object.

## Conf fields

The following fields are read the conf object during execution and can be placed
in any file that makes sense.

* `httpPort` *NUMBER* **REQUIRED** The TCP port for the http interface to run
on.
* `wallet` *OBJECT* **REQUIRED** Configuration of the Etherum account. It take
the following fields:
	* `privateKey` *STRING* **REQUIRED** The private key for the Etherum account
	. This should be stored in `secrets.js`
* `isGPUnode` *BOOL* If the current node is a accepting jobs.


### Conf fields end users should not mess with

The following fields should not be edited unless you fully understand what they
do. Little to know error checking can be done to determine valid but wrong
settings are applied.

* `ethAddress` *STRING* **REQUIRED** The remote Etherum node to connect to.
* `jobFactoryContractAddress` *STRING* **REQUIRED** The contract address
* `auctionFactoryContractAddress` *STRING* **REQUIRED** The auction address
* `morphwareTokenContractAddress` *STRING* **REQUIRED** The Morphware address



