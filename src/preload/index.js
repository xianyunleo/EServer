import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";

// Custom APIs for renderer
const api = {
    callStatic: async (className, methodName, ...args) => {
        return await ipcRenderer.invoke("callStatic", className, methodName, ...args);
    },
    workerCallStatic: async (className, methodName, ...args) => {
        return await ipcRenderer.invoke("workerCallStatic", className, methodName, ...args);
    }
};
// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
    try {
        contextBridge.exposeInMainWorld("electron", electronAPI);
        contextBridge.exposeInMainWorld("api", api);
    } catch (error) {
        console.error(error);
    }
} else {
    window.electron = electronAPI;
    window.api = api;
}
