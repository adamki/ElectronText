const electron = require('electron');
const app      = electron.app;
const BrowserWindow = electron.BrowserWindow;
const dialog = electron.dialog;
const fs     = require('fs');

var mainWindow = null;

app.on('ready', function(){
  mainWindow = new BrowserWindow();
  mainWindow.loadURL('file://' + __dirname + '/index.html');
  //mainWindow.webContents.openDevTools();

  openFile();

  mainWindow.on('closed', function(){
    mainWindow = null;
  })
});

function openFile() {
  var files = dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      {name: 'Markdown Files', extensions: ['md', 'markdown', 'txt']}
    ]
  });

  if (!files) { return; }

  var file = files[0];
  var content = fs.readFileSync(file).toString();

  mainWindow.webContents.send('file-opened', content);
}

const saveFile = function (content) {
  var fileName = dialog.showSaveDialog(mainWindow, {
    title: 'Save HTML Output',
    defaultPath: app.getPath('documents'),
    filters: [
      { name: 'HTML Files', extensions: ['html'] }
    ]
  });

  if (!fileName) { return; }

  fs.writeFileSync(fileName, content);
};

exports.saveFile = saveFile;

exports.openFile = openFile;
