import { app, Tray, Menu, nativeImage } from 'electron'
import { APP_NAME } from '@/shared/utils/constant'
import { isMacOS, isWindows } from '@/main/utils/utils'
import { t } from '@/main/utils/i18n'
import MainWindow from '@/main/MainWindow'
import trayIcon from '@/../resources/img/icons/icon-tray.png?asset'
import trayMacIcon from '@/../resources/img/icons/icon-tray-Mac.png?asset'

export default class TrayManage {
    static _instance

    static init() {
        if (this._instance) return
        let iconPath = this.getIconPath()
        let icon = nativeImage.createFromPath(iconPath).resize({ width: 18, height: 18 })
        icon.setTemplateImage(true)
        let tray = new Tray(icon)
        const contextMenu = this.getContextMenu()
        tray.setToolTip(APP_NAME)
        tray.setContextMenu(contextMenu)
        if (isWindows) {
            tray.on('click', () => this.showMainWindow())
        }
        this._instance = tray
    }

    static getContextMenu() {
        return Menu.buildFromTemplate([
            {
                label: t('Open'),
                click: () => this.showMainWindow()
            },
            {
                label: t('Exit'),
                click: () => app.quit()
            }
        ])
    }

    static showMainWindow() {
        MainWindow.show()
    }

    static updateContextMenu() {
        this._instance.setContextMenu(this.getContextMenu())
    }

    static getIconPath() {
        if (isMacOS) {
            return trayMacIcon
        }
        return trayIcon
    }
}
