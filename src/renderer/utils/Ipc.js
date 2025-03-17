import { onUnmounted } from 'vue'

export default class Ipc {
    static async call(funName, ...args) {
        return await window.electron.ipcRenderer.invoke('call', funName, ...args)
    }

    static async callStatic(className, methodName, ...args) {
        return await window.electron.ipcRenderer.invoke('callStatic', className, methodName, ...args)
    }

    static on(channel, callback) {
        const listener = (_event, ...args) => callback(...args)
        onUnmounted(() => {
            window.electron.ipcRenderer.removeListener(channel, listener)
        })
        return window.electron.ipcRenderer.on(channel, listener)
    }

    static onGlobal(channel, callback) {
        const listener = (_event, ...args) => callback(...args)
        return window.electron.ipcRenderer.on(channel, listener)
    }
}
