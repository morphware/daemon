"use strict";

const extend = require("extend");
const fs = require("fs-extra");
var args = require("args");
const packageJSON = require("../package");

// Throw errors letting users know if required conf files are missing
function load(filePath, required) {
  try {
    return require(filePath);
  } catch (error) {
    if (error.name === "SyntaxError") {
      console.error(`Loading ${filePath} file failed!\n`, error);
      process.exit(1);
    } else if (error.code === "MODULE_NOT_FOUND") {
      console.warn(`No config file ${filePath}! This may cause issues...`);
      if (required) {
        process.exit(1);
      }
      return {};
    } else {
      console.dir(`Unknown error in loading ${filePath} config file.\n`, error);
    }
  }
}

// Apply changes to local conf
function editLocalConf(args) {
  localConf = { ...localConf, ...args };
  console.log("Backend updated conf: ", localConf);
  fs.writeJsonSync(runtimeConf.appDataLocal, localConf);
  switch (process.platform) {
    case "linux":
      if (
        localConf.appDownloadPath &&
        localConf.appDownloadPath.slice(-1) !== "/"
      ) {
        localConf.appDownloadPath += "/";
      }
      break;
    case "darwin":
      if (
        localConf.appDownloadPath &&
        localConf.appDownloadPath.slice(-1) !== "/"
      ) {
        localConf.appDownloadPath += "/";
      }
      break;
    case "win32":
      if (
        localConf.appDownloadPath &&
        localConf.appDownloadPath.slice(-1) !== "\\"
      ) {
        localConf.appDownloadPath += "\\";
      }
      break;
  }
  return localConf;
}

// Determine if this is being called from a packages electron app;
try {
  const { app } = require("electron");
  var isPackaged = app.isPackaged;
} catch (error) {
  var isPackaged = false;
}

// Set the command line argument options
args
  .option("httpPort", "http port")
  .option("electronDev", "Load chrome dev tools")
  .option("ethAddress", "Remote etherum node")
  .option("appDataPath", "Path where local data is held")
  .option("appDownloadPath", "Path for downloads")
  .option(
    "role",
    'The role your client will assume.  Provide "Poster" (Post model training jobs), "Worker" (Accept model training jobs) or "Validator" (Accept model training jobs)'
  )
  .option("torrentListenPort", "The port to seed and peer files from")
  .option("miningCommand", "A global command used to start mining")
  .option("validatorId", "The validator node id in the morphware cluster")
  .option("privateKey", "Wallet Object", undefined, (value) => {
    return [value];
  });

// Parse command line arguments
var runtimeConf = args.parse(process.argv, {
  mri: {
    string: ["p", "privateKey"],
  },
});

// Include the current version
runtimeConf.version = packageJSON.version;

// Set the correct `NODE_ENV`
const environment =
  process.env.NODE_ENV || (isPackaged ? "production" : "development");

// Grab the base conf, we will need it for the rest of the file
var baseConf = load("./base", true);

// Set the correct local data path based platform
if (!runtimeConf.appDataPath) {
  switch (process.platform) {
    case "linux":
      runtimeConf.appDataPath = `${process.env.HOME}/.local/share/`;
      break;
    case "darwin":
      runtimeConf.appDataPath = `${process.env.HOME}/Library/Preferences/`;
      break;
    case "win32":
      runtimeConf.appDataPath = process.env.APPDATA;
      break;
  }
}

// Set a unique path for Morphware
runtimeConf.appDataPath += `${baseConf.appName}${
  environment === "production" ? "" : "-" + environment
}/`;
runtimeConf.appDataLocal = `${runtimeConf.appDataPath}local.json`;

// Create the `appDataPath` if it doesnt exist
fs.ensureDirSync(runtimeConf.appDataPath);

// Create `local.json` if it doesnt exist
if (!fs.pathExistsSync(runtimeConf.appDataLocal)) {
  console.log("making appData file ", runtimeConf.appDataLocal);
  fs.writeJsonSync(runtimeConf.appDataLocal, {});
}

// Grab local config
var localConf = load(runtimeConf.appDataLocal);

// Set the correct appDownloadPath if its not specified
if (!localConf.appDownloadPath) {
  runtimeConf.appDownloadPath = `${runtimeConf.appDataPath}downloads/`;
}

// Make sure download directory exists
fs.ensureDirSync(runtimeConf.appDownloadPath || localConf.appDownloadPath);

// Build the complete conf object
var conf = extend(
  true, // enable deep copy
  baseConf, // Base conf gets loaded fist
  load(`./${environment}`), // Load any environment settings
  localConf, // Load local settings
  runtimeConf, // Settings applied at runtime trump all!
  { environment }
);

module.exports = { conf, localConf, editLocalConf };
