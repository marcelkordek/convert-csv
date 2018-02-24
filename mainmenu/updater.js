/**
 * updater.js
 *
 * Please use manual update only when it is really required, otherwise please use recommended non-intrusive auto update.
 *
 * Import steps:
 * 1. create `updater.js` for the code snippet
 * 2. require `updater.js` for menu implementation, and set `checkForUpdates` callback from `updater` for the click property of `Check Updates...` MenuItem.
 */
const { app, dialog } = require('electron')
const { autoUpdater } = require('electron-updater')

let updater;
autoUpdater.autoDownload = false

autoUpdater.on('error', (error) => {
  //dialog.showErrorBox('Error: ', error == null ? "unknown" : (error.stack || error).toString())
})

autoUpdater.on('update-available', () => {
  var dock = app.dock
  dock.setBadge('' + 1)

  dialog.showMessageBox({
    type: 'info',
    title: 'Update verfügbar',
    message: 'Update verfügbar, jetzt installieren?',
    buttons: ['Ja', 'Später']
  }, (buttonIndex) => {
    if (buttonIndex === 0) {
      autoUpdater.downloadUpdate()
    }
    else {
      if (!updater == null) {
        updater.enabled = true
        updater = null
      }
    }
  })
})

autoUpdater.on('update-not-available', () => {
  var dock = app.dock
  if (!updater == null) {
    dock.setBadge('')

    dialog.showMessageBox({
      title: 'Kein Update verfügbar',
      message: 'Kein Update verfügbar, Version ist aktuell.'
    })

    updater.enabled = true
    updater = null
  }
})

autoUpdater.on('update-downloaded', () => {
  dialog.showMessageBox({
    title: 'Update installieren',
    message: 'Update wurde herunter geladen, Programm wird zum installieren neu gestartet!'
  }, () => {
    setImmediate(() => autoUpdater.quitAndInstall())
  })
})

// export this to MenuItem click callback
function checkForUpdates(menuItem, focusedWindow, event) {
  updater = menuItem;
  updater.enabled = false;
  autoUpdater.checkForUpdatesAndNotify();
  //autoUpdater.checkForUpdates()
}
module.exports.checkForUpdates = checkForUpdates