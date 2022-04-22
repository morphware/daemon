# Morphware client

This project is the mono repo for the Morphware client. This code base has all
the end user functionality:

* Morphware wallet
  * View balance
  * Send funds
  * Receive funds
  * View transaction history
* Create job
* Bid on, and work on jobs

The primary release package are portable Windows and Linux binary's as well as
Windows installers, DEB and RPM packages.

## Repo layout

This is a *mono repo* containing the front end React project for the UI, the
back end express.js project for the business logic and the electron project we
use mostly as a multi platform build system. Here is a general overview of the
files and folders:

* daemon - *project root*
  * app-src/ - *temporary directory that is built during the build process. This
    is not tracked*
  * backend/ - *express.js project*
    * conf/ - *holds the configuration for the whole project. See
      [conf docs](docs/conf.md)*
  * dist/ - *outputted files from the build process. This is not tracked*
  * docs/ - *project documentation*
  * frontend/ - *react UI project*
  * node_modules/ - *node dependencies for the electron and the build process.
    This is not tracked*
  * resources/ - *Static resources used in the electron build, mostly icons ATM*
  * unsorted/ - *Random items from before the reactor. It will be removed at
    some point...*
  * build.js - *script to execute the build process*
  * devRun.js - *script to execute the various development environments for all
    sub projects*
  * electron - *Electron run file. This also starts express when packaged.*
  * preload.js - *data to be preloaded in the electron UI. This file is not
    required, built at runtime and not tracked*
  * package.json - *Manages build and electron dependencies. Contains npm scripts*

## Local development

All code is currently in NodeJS. To do local dev work, you need to have NodeJS
14.x installed. If you are on Linux, we recommend
[NodeSource](https://github.com/nodesource/distributions) to install the correct
version, as your OS package manager may have older(or newer) version. Windows
users on WSL should also use NodeSource. Other Windows can find the correct
installer on the [NodeJS website](https://nodejs.org). *Insert blurb about
NodeJS on OSX*

You need to have Python3.x.x and pip3.

You will also need Git to clone and push the code.

Once you have all the required system dependencies, clone this repo and move to
it.

This will call npm install for each of the sub projects in the repo.
Install the node dependencies with the following command:

```bash
npm install
```

To get a full envelopment run of the project, execute:
```bash
npm run dev
```

You can also move into `frontend` or `backend` and just run each project in dev
mode.

```bash
npm start
```

## Build

The project uses [electron-build](https://www.electron.build/) to compile the
app. The build conf is stored in `project.json` under the `build` key. Building
has only been executed under Linux. @wmantly is putting together a build document
and is coming soon.

At some point soon, we will set up a CI/CD pipeline to build.

**This requires a lot of system packages, run with care**

To execute a build, run:

`npm run build`

## CLI

The CLI is meant to assist in development work and production build debugging. I
would like to allow all conf options to be set via the CLI.

```bash
08:41 PM william$ npm run dev -- --help

> Morphware-Wallet@0.0.1 dev
> node devRun.js "--help"

  Usage: devRun.js [options] [command]

  Commands:
    help     Display help
    version  Display version

  Options:
    -A, --appDataPath  Path where local data is held
    -e, --electronDev  Load chrome dev tools
    -E, --ethAddress   Remote etherum node
    -H, --help         Output usage information
    -h, --httpPort     http port
    -p, --privateKey   Wallet Object
    -v, --version      Output the version number
    -r, --role         Clients assumed role. "Poster", "Worker" or "Validator"

```

## Examples:

To start as a poster
```bash
npm run dev -- -r Poster -h 3050 -p 5a9d1c7444c0548431e68d83d5a2e4818cf940322a419bc490a3de05650fc9ff
```

To start as a worker
```bash
npm run dev -- -r Worker -h 3008 -p 82835eb03485554b79a0b3888b82a95a529019c66c2067b8ebf355c436988958
```

To start as a validator
```bash
npm run dev -- -r Validator -t 3034 -h 3010 -p cc5fb6d661b791851ad5cbbd9ca1611fd131acc03f1a66e03076d32c315cae72 -v 0
```

Running headlessly:
poster
```
npm run dev -- -r "Poster" -p 5a9d1c7444c0548431e68d83d5a2e4818cf940322a419bc490a3de05650fc9ff
```
worker
```
npm run dev -- -r "Worker" -t 3034 -h 3008 -p cc5fb6d661b791851ad5cbbd9ca1611fd131acc03f1a66e03076d32c315cae72
```
validator0
```
npm run dev -- -r "Validator" -v 0 -t 3035 -h 3010 -p 82835eb03485554b79a0b3888b82a95a529019c66c2067b8ebf355c436988958
```
validator1
```
npm run dev -- -r "Validator" -v 1 -t 3036 -h 3010 -p 0b8ac89108a351036e5786dcdad47f78ce70d74a4bba48587df41d8967d05712
```


When a job is being worked on by the worker node or validated by the validator node, a new virtual env is created. We read the import statements in the ipython notebook and install the packages on the fly.
