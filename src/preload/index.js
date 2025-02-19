import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
    call: async (funName, ...args) => {
        return await ipcRenderer.invoke('call', funName, ...args)
    },
    callStatic: async (className, methodName, ...args) => {
        return await ipcRenderer.invoke('callStatic', className, methodName, ...args)
    },
    onMainWindowMaximize: (callback) => ipcRenderer.on('mainWindowMaximize', (_event, ...args) => callback(...args)),
    onMainWindowUnmaximize: (callback) => ipcRenderer.on('mainWindowUnmaximize', (_event, ...args) => callback(...args)),
    onAppDlProgress: (callback) => ipcRenderer.on('childApp-downloadProgress', (_event, ...args) => callback(...args)),
    onAppDlCancelled: (callback) => ipcRenderer.on('childApp-downloadCancelled', (_event, ...args) => callback(...args)),
    onAppInstStatus: (callback) => ipcRenderer.on('childApp-installStatus', (_event, ...args) => callback(...args))
}
// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
    try {
        contextBridge.exposeInMainWorld('electron', electronAPI)
        contextBridge.exposeInMainWorld('api', api)
    } catch (error) {
        console.error(error)
    }
} else {
    window.electron = electronAPI
    window.api = api
}
