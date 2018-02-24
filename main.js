const {app, Menu, BrowserWindow, ipcMain, dialog} = require('electron');
const {autoUpdater} = require("electron-updater");
const log = require('electron-log');
const isDev = require('electron-is-dev');

const path = require('path')
const url = require('url')
const fs = require('fs');

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

// set autopdater options
// autoUpdater.allowPrerelease = true;
// autoUpdater.allowDowngrade = true;
autoUpdater.requestHeaders = { "Private-Token": "54f8feb4de48254453d0ea929f46973d8b41c94e"};

// Set Name
app.setName('Convert CSV')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow() {

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 670,
    minWidth: 1200,
    minHeight: 670,
    titleBarStyle: 'hiddenInset',
    frame: false,
    movable: true,
    resizable: true,
    show: false,
    backgroundColor: '#ececec',
    icon: __dirname + '/build/icon.png'
  })

  // and load the index.html of the app.
  // mainWindow.loadURL(url.format({
  //   pathname: path.join(__dirname, 'index.html'),
  //   protocol: 'file:',
  //   slashes: true
  // }))
  //mainWindow.loadURL('http://smartoffice.local')
  mainWindow.loadURL('file://' + __dirname + '/index.html');

  // Open the DevTools.
  //mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  mainWindow.webContents.on('dom-ready', function (e) {
    //mainWindow.webContents.executeJavaScript('document.getElementsByTagName("html")[0].className += " platform-' + process.platform + '" ')
  })

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  require('./mainmenu/menu')
}

// when the app is loaded create a BrowserWindow and check for updates
app.on('ready', function() {
    createWindow()
    if (!isDev) autoUpdater.checkForUpdatesAndNotify();
  });

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  // if (process.platform !== 'darwin') {
  //   app.quit()
  // }
  app.quit()
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
