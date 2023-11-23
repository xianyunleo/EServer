import { ipcMain } from 'electron'
import { callStatic } from '@/main/common/call'

export function ipcListen() {
    ipcMain.handle('callStatic', async (event, className, methodName, ...args) => {
        return await callStatic(className, methodName, ...args)
    })
}
