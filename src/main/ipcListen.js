import { app, ipcMain } from 'electron'
import { callStatic } from '@/main/common/call'
import Installer from '@/main/core/software/Installer'
import Downloader from 'electron-dl-downloader'

ipcMain.handle('call', async (event, funName, ...args) => {
    return await functions[funName](event, ...args)
})

ipcMain.handle('callStatic', async (event, className, methodName, ...args) => {
    return await callStatic(className, methodName, ...args)
})

const functions = {
    appGetVersion: async () => {
        return app.getVersion()
    },
    appExit: async () => {
        return app.exit()
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
    softwareInstall: async (event, name) => {
        const installer = new Installer(name)
        installer.on('status', (status) => {
            event.sender.send('software-installStatus', name, status)
        })

        const dlItem = await installer.install()
        dlItem.on('updated', (event2, state) => {
            if (state === Downloader.STATES.progressing) {
                const progress = { receivedBytes: dlItem.getReceivedBytes(), totalBytes: dlItem.getTotalBytes() }
                event.sender.send('software-downloadProgress', name, progress)
            } else {
                event.sender.send('software-downloadCancelled', name)
            }
        })
        dlItem.once('done', (event2, state) => {
            if (state !== 'completed') {
                event.sender.send('software-downloadCancelled', name)
            }
        })
        await installer.whenDone()
    },
    softwareStopInstall: async (event, name) => {
        const dlItem = Installer.DownloadItemMap.get(name)
        dlItem?.cancel()
    },
    softwareUninstall: async (event, name) => {
        return await Installer.uninstall(name)
    }
}
