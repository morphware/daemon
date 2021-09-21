'use strict';

const path = require('path');
const { app, BrowserWindow, Tray, Menu } = require('electron');
let win = null
let tray = null;


if(app.isPackaged){

  // Pad arvg to comply with the args package.
  // Filed issue https://github.com/leo/args/issues/158
  process.argv.unshift('.');
  const expressApp = require('./express');
}

const {conf} = require(`./${app.isPackaged ?'': 'backend/'}conf`);

console.info(`${conf.appName}, ${conf.environment} version ${app.getVersion()}`)

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1540,
    height: 850,
    "autoHideMenuBar": true,
    "minWidth": 1540,
    "minHeight": 850,
    icon: `${__dirname}/resources/icons/64x64.png`,
    webPreferences: {
      nativeWindowOpen: true,
      nodeIntegration: true,
      webSecurity: false,
      plugins: true,
      enableRemoteModule: false,
      preload: `${__dirname}/preload.js`
    },
  });

  // and load the index.html of the app.
  win.loadURL(app.isPackaged ? 
    `file://${path.join(__dirname, './www/index.html')}` :
    'http://localhost:3000'
  );

  // Open the DevTools.
  if(conf.electronDev) {
    win.webContents.openDevTools({ mode: 'detach' });
  }

  win.on('close', function (event) {
    event.preventDefault();
    win.hide();
    event.returnValue = false;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

app.whenReady().then(() => {
  try{
    tray = new Tray(`${__dirname}/resources/icons/512x512.png`);
      var contextMenu = Menu.buildFromTemplate([
        {
            label: 'Show App', click: function () {
                win.show()
            }
        },
        {
            label: 'Quit', click: function () {
                app.isQuiting = true
                app.quit()
                process.exit(0);
            }
        }
    ])

    tray.setToolTip('Morphware Wallet')

    tray.on('click', function(e){
      console.log('clicked!')
      if(!win.isVisible()) {
        win.show()
      }
    });

    tray.setContextMenu(contextMenu)


  }catch(error){
    console.log('tray error', error);
  }
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    // app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
