import { ipcMain } from 'electron'
import { callStatic } from '@/main/common/call'
import Settings from '@/main/Settings'
import SystemTheme from '@/main/utils/SystemTheme'
import { color } from '@/shared/utils/constant'

export function ipcListen() {
    ipcMain.handle('callStatic', async (event, className, methodName, ...args) => {
        return await callStatic(className, methodName, ...args)
    })

    ipcMain.on('getColors', (event) => {
        const settings = Settings.getAll()
        const isDarkModel = SystemTheme.isDarkModel()
        const isDark = settings.ThemeMode === 'dark' || (settings.ThemeMode === 'system' && isDarkModel)
        const themeObj = isDark ? color.dark : color.light
        event.returnValue = {
            bgColor: themeObj.bgColor,
            borderColor: themeObj.borderColor
        }
    })
}
