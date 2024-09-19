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
    onSoftDlProgress: (callback) => ipcRenderer.on('software-downloadProgress', (_event, ...args) => callback(...args)),
    onSoftDlCancelled: (callback) => ipcRenderer.on('software-downloadCancelled', (_event, ...args) => callback(...args)),
    onSoftInstStatus: (callback) => ipcRenderer.on('software-installStatus', (_event, ...args) => callback(...args))
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
