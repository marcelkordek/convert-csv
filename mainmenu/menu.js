const { app, Menu, BrowserWindow } = require('electron')
const isDev = require('electron-is-dev');
const update = require('./updater');

const template = [{
  label: 'Anzeigen',
  submenu: [{
    label: 'Neu laden',
    accelerator: 'CmdOrCtrl+R',
    click: function (item, focusedWindow) {
      if (focusedWindow) {
        // on reload, start fresh and close any old
        // open secondary windows
        if (focusedWindow.id === 1) {
          BrowserWindow.getAllWindows().forEach(function (win) {
            if (win.id > 1) {
              win.close()
            }
          })
        }
        focusedWindow.reload()
      }
    }
  },
  {
    label: 'Toggle Developer Tools',
    accelerator: 'Alt+Command+I',
    click: function () { BrowserWindow.getFocusedWindow().toggleDevTools(); },
    visible: isDev
  }, {
    label: 'Vollbild umschalten',
    accelerator: (function () {
      if (process.platform === 'darwin') {
        return 'Ctrl+Command+F'
      } else {
        return 'F11'
      }
    })(),
    click: function (item, focusedWindow) {
      if (focusedWindow) {
        focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
      }
    }
  }, {
    type: 'separator'
  }]
}, {
  label: 'Hilfe',
  role: 'help',
  submenu: [{
    label: 'Erfahren Sie mehr',
    click: function () {
      electron.shell.openExternal('http://electron.atom.io')
    }
  }]
}]

template.unshift({
  label: 'Bearbeiten',
  submenu: [
    {
      label: 'Undo',
      accelerator: 'Command+Z',
      selector: 'undo:'
    },
    {
      label: 'Redo',
      accelerator: 'Shift+Command+Z',
      selector: 'redo:'
    },
    {
      type: 'separator'
    },
    {
      label: 'Cut',
      accelerator: 'Command+X',
      selector: 'cut:'
    },
    {
      label: 'Copy',
      accelerator: 'Command+C',
      selector: 'copy:'
    },
    {
      label: 'Paste',
      accelerator: 'Command+V',
      selector: 'paste:'
    },
    {
      label: 'Select All',
      accelerator: 'Command+A',
      selector: 'selectAll:'
    },
  ]
})

if (process.platform === 'darwin') {
  const name = app.getName()
  template.unshift({
    label: name,
    submenu: [{
      label: `Über ${name}`,
      role: 'about'
    },{
      label: 'Auf Update prüfen ',
      click(item, focusedWindow, event) { update.checkForUpdates(item, focusedWindow, event); }
    }, {
      type: 'separator'
    }, {
      type: 'separator'
    }, {
      label: `${name} ausblenden`,
      accelerator: 'Command+H',
      role: 'hide'
    }, {
      label: 'Andere ausblenden',
      accelerator: 'Command+Alt+H',
      role: 'hideothers'
    }, {
      label: 'Alle einblenden',
      role: 'unhide'
    }, {
      type: 'separator'
    }, {
      label: `${name} beenden`,
      accelerator: 'Command+Q',
      click: function () {
        app.quit()
      }
    }]
  })
}

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)