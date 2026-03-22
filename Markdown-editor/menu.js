const { app,Menu, shell, BrowserWindow, ipcMain, globalShortcut, dialog } = require('electron');
const fs = require('fs');

ipcMain.on('editor-reply', (event, arg) => {
    console.log(`Received reply from web page: ${arg}`);
});

function saveFile() {
    console.log('Saving the file');
    const window = BrowserWindow.getFocusedWindow();
    window.webContents.send('editor-event', 'save');
}

function loadFile() {
    const window = BrowserWindow.getFocusedWindow();
    const options = {
        title: 'Pick a markdown file',
        filters: [
            { name: 'Markdown files', extensions: ['md'] },
            { name: 'Text files', extensions: ['txt'] }
        ]
    };
    dialog.showOpenDialog(window, options).then(result => {
        if (!result.canceled && result.filePaths.length > 0) {
            const content = fs.readFileSync(result.filePaths[0]).toString();
            window.webContents.send('load', content);
        }
    }).catch(err => {
        console.log('Error al abrir archivo:', err);
    });
}

const template = [
    
    {
        label: 'File',
        submenu: [
            {
                label: 'Open',
                accelerator: 'CommandOrControl+O',
                click() {
                    loadFile();
                }
            },
            {
                label: 'Save',
                accelerator: 'CommandOrControl+S',
                click() {
                    saveFile();
                }
            }
        ]
    },
    
    {

        label: 'Format',
        submenu: [
            {
                label: 'Toggle Bold',
                click() {
                    const focusedWindow = BrowserWindow.getFocusedWindow();
                    focusedWindow.webContents.send('editor-event', 'toggle-bold');
                }
            },
            {
                label: 'Toggle Italic',
                click() {
                    const focusedWindow = BrowserWindow.getFocusedWindow();
                    focusedWindow.webContents.send('editor-event', 'toggle-italic');
                }
            },
            {
                label: 'Toggle Strikethrough',
                click() {
                    const focusedWindow = BrowserWindow.getFocusedWindow();
                    focusedWindow.webContents.send('editor-event', 'toggle-strikethrough');
                }
            }
        ]
    },
    
    {
        role: 'help',
        submenu: [
            {
                label: 'About Editor Component',
                click() {
                    shell.openExternal('https://simplemde.com/');
                }
            }
        ]
    }, 
 ];

 if (process.platform === 'win32') {    
    template.unshift({
        label: 'File',
        submenu: [
            { 
                label: `Exit ${app.getName()}`,
                role: 'quit' 
            }
        ]
    });

    const helpMenu = template.find(item => item.role === 'help');
    if (helpMenu) {
        helpMenu.submenu.push(
            { type: 'separator' },
            {
                label: `About ${app.getName()}`,
                role: 'about' 
            }
        );
    }
}

if (process.env.DEBUG) {
    template.push({
        label: 'Debugging',
        submenu: [
            {
                label: 'Dev Tools',
                role: 'toggleDevTools'
            },
            { type: 'separator' },
            {
                role: 'reload',
                accelerator: 'Alt+R'
            }
        ]
    });
}

ipcMain.on('save', (event, arg) => {
    console.log(`Saving content of the file`);
    
    const window = BrowserWindow.getFocusedWindow();
    
    const options = {
        title: 'Save markdown file',
        filters: [
            {
                name: 'MyFile',
                extensions: ['md'] 
            }
        ]
    };
    
    globalShortcut.register('CommandOrControl+O', () => {
        const window = BrowserWindow.getFocusedWindow();
        const options = {
            title: 'Pick a markdown file',
            filters: [
                { name: 'Markdown files', extensions: ['md'] },
                { name: 'Text files', extensions: ['txt'] }
            ]
        };
        
       dialog.showOpenDialog(window, options).then(result => {
            if (!result.canceled && result.filePaths.length > 0) {

            const content = fs.readFileSync(result.filePaths[0]).toString();
            window.webContents.send('load', content); 

            }
        }).catch(err => {
            console.log('Error al abrir archivo:', err);
        });
    });

    dialog.showSaveDialog(window, options).then(result => {
        
        if (!result.canceled) {
            
            console.log(result.filePath);

            fs.writeFileSync(result.filePath, arg); 
            console.log('File saved successfully!');
            
        }
        }).catch(err => {
            console.log(err);
        });

    });

const menu = Menu.buildFromTemplate(template);
module.exports = { menu, saveFile, loadFile };