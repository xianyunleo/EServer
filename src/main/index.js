'use strict'

import * as remoteMain  from '@electron/remote/main'
import { app, protocol, BrowserWindow } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'
import Store from "electron-store"
import TrayManager from "@/main/TrayManager";
import MainWindow from "@/main/MainWindow";

const isDevelopment = process.env.NODE_ENV !== 'production'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

 let mainWindow;

const gotTheLock = app.isPackaged ? app.requestSingleInstanceLock() : true; //仅生产环境生效

if (!gotTheLock) {
    app.quit()
} else {
    onReady();
    onRunning()
    onBeforeQuit();
    remoteMain.initialize();
    Store.initRenderer();
}

async function createWindow() {
  // Create the browser window.
    mainWindow = new BrowserWindow({
    width: isDevelopment ? 1280 : 880,
    height: 650,
    minWidth: 880,
    minHeight: 650,
    resizable:true,
    titleBarStyle:'hiddenInset',
    frame: !(process.platform === 'win32'),
    vibrancy:'window',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      webSecurity:false,
    }
  })

  remoteMain.enable(mainWindow.webContents);

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await mainWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) mainWindow.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
      mainWindow.loadURL('app://./index.html')
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

function onBeforeQuit() {
    app.on('before-quit', () => {
        MainWindow.forceQuit = true;
    })
}

function onReady(){
    app.on('ready', async () => {
        if (isDevelopment && !process.env.IS_TEST) {
            // Install Vue Devtools
            try {
                await installExtension(VUEJS3_DEVTOOLS)
            } catch (e) {
                console.error('Vue Devtools failed to install:', e.toString())
            }
        }
        createWindow();

        TrayManager.init(mainWindow);
        MainWindow.init(mainWindow)
    })
}

function onRunning() {
    app.on("second-instance", () => {
        // 当运行第二个实例时,将会聚焦到mainWindow这个窗口
        if (mainWindow && app.isPackaged) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.show();
        }
    });
    //activate only macos
    app.on("activate", () => {
        mainWindow.show();
    });
}

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

app.commandLine.appendSwitch('--no-sandbox');
