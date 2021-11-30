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


## Local paths

When the application is packaged by electron and ran as a distrusted executable
the `conf` folder is not accessible. If the `conf` object detects this state, it
will look for (and make if need) a `local.json` file in the user app data
location.

On Linux this is `/home/<USER>/.local/share/MorphwareWallet[-environment]/`
	
On Windows `C:\Users\<USER>\AppData\Roaming\MorphwareWallet[-environment]\` or
	where ever `APPDATA` is configure for that system

On OSX `/home/<USER>/Library/Preferences/MorphwareWallet[-environment]/`

`-environment` will only be added if its not production

## Conf fields

The following fields are used in the conf object during execution and can be
placed in any file file that makes sense.

* `httpBindAddress` *STRING* **REQUIRED** IP for the HTTP server to bind
* `httpPort` *NUMBER* **REQUIRED** The TCP port for the HTTP interface to listen
on.
* `privateKey` *ARRAY* **REQUIRED** The private key for the Etherum account
  . This should be stored in `secrets.js`
* `role` *STRING* The clients role. "Poster", "Worker" or "Validator"
* `electronDev` *BOOL* Bring up the chrome dev tools in electron.
* `appDownloadPath` *STRING* Absolute path where downloads are kept.
* `torrentListenPort` *STRING* TCP port for the torrent client to listen on
* `miningCommand` *STRING* A global mining command the worker can run
* `workerGPU` *STRING* Name of GPU worker is using

## Dev fields
User may edit these fields, but they are mostly meant for dev issues.

* `appDataPath` *STRING* path where local data will be stored, including
  local settings file and downloaded data. See
  `Local settings on built packages` for there this will be set automatically.


### Conf fields users should not mess with

The following fields should not be edited unless you fully understand what they
do. Little to no error checking can be done to determine if valid but wrong
settings are applied.

* ``appName` *STRING* **REQUIRED** App name used for making conf paths. Changing
	this will change where local settings files are held.
* `ethAddress` *STRING* **REQUIRED** The remote Etherum node to connect to.
* `jobFactoryContractAddress` *STRING* **REQUIRED** The contract address
* `auctionFactoryContractAddress` *STRING* **REQUIRED** The auction address
* `morphwareTokenContractAddress` *STRING* **REQUIRED** The Morphware address


## Usage

Simply require the conf directory relative to the current file;

```js
const {conf} = require('./conf');

console.log(conf.httpPort)
// 3000

```

Changes made to the conf object during run time are not persistent.

## Settings to add

