/* global __static */
import {app, Tray, Menu, nativeImage} from 'electron'
import Path from "@/main/utils/Path";
import {APP_NAME} from "@/shared/constant";

export default class TrayManager {
    /**
     *
     * @param mainWindow {BrowserWindow}
     */
    static init(mainWindow) {
        let iconPath = Path.Join(__static, 'img/icons/icon-Mac-tray.png');
        let icon = nativeImage.createFromPath(iconPath).resize({width: 18, height: 18})
        icon.setTemplateImage(true);
        let tray = new Tray(icon);
        const contextMenu = Menu.buildFromTemplate([
            {
                label: '主面板', click: () => {
                    mainWindow.show();
                }
            },
            {
                label: '退出', click: () => {
                    app.exit();
                }
            },
        ])
        tray.setToolTip(APP_NAME)
        tray.setContextMenu(contextMenu)
    }
}
