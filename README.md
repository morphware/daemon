# Morphware client

This project is the mono repo for the Morphware client. This code base has all
the end user functionality:

* Morphware wallet
  * View balance
  * Send founds
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

* deamon - *project root*
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
  * build.js - *script to execute the build process*
  * devRun.js - *script to execute the various development environments for all
    sub projects*
  * electron-prod.js - *main file that lunches electron in a build*
  * electron - *main file that lunches electron in during dev*
  * preload.js - *data to be preloaded in the electron UI. This file is not
    required, built at runtime and not tracked*
  * package.json - *Manages build and electron dependencies. Contains npm scrips*

## Local development

All code is currently in NodeJS. To do local dev work, you need to have NodeJS
14.x installed. If you are on Linux, we recommend
[NodeSource](https://github.com/nodesource/distributions) to install the correct
version, as your OS package manager may have older(or newer) version. Windows
users on WSL should also use NodeSource. Other Windows can find the correct
installer on the [NodeJS website](https://nodejs.org). *Insert blurb about
NodeJS on OSX*

You will also need Git to clone and push the code.

Once you have all the required system dependencies, clone this repo and move to
it.

This will call npm install for each of the sub projects in this repo.
Install the node dependencies with the following command:

```bash
npm install
```

To get a full envelopment run of the project, execute:
```bash
npm run dev
```

You can also move into `forntend` or `backend` and just run each project in dev
mode.

## Build

The project uses [electron-build](https://www.electron.build/) to compile the
app. The build conf is stored in `project.json` under the `build` key. Building
has only been executed under Linux. @wmantly is putting together a build document
and is coming soon.

**This requires alot of system packages, run with care**

To execute a build, run:

```bash
npm run build
```
