import { app, ipcMain } from 'electron'
import { callStatic } from '@/main/common/call'
import Installer from '@/main/services/childApp/Installer'
import Downloader from 'electron-dl-downloader'

ipcMain.handle('call', async (event, funName, ...args) => {
    return await functions[funName](event, ...args)
})

ipcMain.handle('callStatic', async (event, className, methodName, ...args) => {
    return await callStatic(className, methodName, ...args)
})
const dlPerSecondItems = {}
const functions = {
    appGetVersion: async () => {
        return app.getVersion()
    },
    appExit: async () => {
        return app.exit()
    },
    appRestart: async () => {
        app.relaunch()
        app.exit()
    },
    fileGetIcon: async (event, path, options) => {
        return await app.getFileIcon(path, options)
    },
    windowSwitchMax: async (event) => {
        const win = event.sender.getOwnerBrowserWindow()
        if (win.isMaximized()) {
            win.unmaximize()
        } else {
            win.maximize()
        }
    },
    windowMinimize: async (event) => {
        event.sender.getOwnerBrowserWindow().minimize()
    },
    windowClose: async (event) => {
        event.sender.getOwnerBrowserWindow().close()
    },
    childAppInstall: async (event, name) => {
        const installer = new Installer(name)
        dlPerSecondItems[name] = { lastReceivedBytes: 0, lastTime: Date.now() }
        installer.on('status', (status) => {
            event.sender.send('childApp-installStatus', name, status)
        })

        const dlItem = await installer.install()
        dlItem.on('updated', (event2, state) => {
            if (state === Downloader.STATES.progressing) {
                const currentTime = Date.now()
                // 每秒计算一次下载速度
                if (currentTime - dlPerSecondItems[name].lastTime >= 1000) {
                    const receivedBytes = dlItem.getReceivedBytes()
                    const totalBytes = dlItem.getTotalBytes()
                    const perSecondBytes = receivedBytes - dlPerSecondItems[name].lastReceivedBytes
                    dlPerSecondItems[name] = { lastReceivedBytes: receivedBytes, lastTime: currentTime }
                    const progress = { receivedBytes, totalBytes, perSecondBytes }
                    event.sender.send('childApp-downloadProgress', name, progress)
                }
            } else {
                event.sender.send('childApp-downloadCancelled', name)
            }
        })
        dlItem.once('done', (event2, state) => {
            if (state !== 'completed') {
                event.sender.send('childApp-downloadCancelled', name)
            }
        })

        try {
            await installer.whenDone()
        } catch (error) {
            event.sender.send('childApp-installError', name, error.message)
            throw error
        }
    },
    childAppStopInstall: async (event, name) => {
        const dlItem = Installer.DownloadItemMap.get(name)
        dlItem?.cancel()
    },
    childAppUninstall: async (event, name) => {
        return await Installer.uninstall(name)
    }
}
