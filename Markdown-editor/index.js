const { app, BrowserWindow, Menu, globalShortcut} = require('electron');
const { menu, saveFile, loadFile } = require('./menu.js');
const { autoUpdater } = require('electron-updater');

let window;

app.on('ready', () => {
    window = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,    
            contextIsolation: false,  
        }
    });

    window.loadFile('index.html');

    autoUpdater.checkForUpdatesAndNotify();

    globalShortcut.register('CommandOrControl+S', () => {
        saveFile();
    });

    globalShortcut.register('CommandOrControl+O', () => {
        loadFile();
    });
    Menu.setApplicationMenu(menu);
    
});