const electron = require("electron");
const app = electron.app;
const ipcMain = electron.ipcMain;
const BrowserWindow = electron.BrowserWindow;

const path = require("path");
const url = require("url");
const isDev = require("electron-is-dev");
const { menu } = require("./menu.js");
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1900,
    height: 1000,
    icon: __dirname + `/assets/newkalimbaicon.png`,
    // fullscreen: true,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  mainWindow.on("closed", () => (mainWindow = null));
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on("display-app-menu", function (e, args) {
  if (mainWindow) {
    menu.popup({
      window: mainWindow,
      x: args.x,
      y: args.y,
    });
  }
});
