/* global __static */
import {app, Tray, Menu, nativeImage} from 'electron'
import Path from "@/main/utils/Path";
import {APP_NAME} from "@/shared/constant";
import OS from "@/main/core/OS";

export default class TrayManager {
    /**
     *
     * @param mainWindow {BrowserWindow}
     */
    static init(mainWindow) {
        let iconPath = TrayManager.getIconPath();
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

    static getIconPath(){
        if(OS.isMacOS()){
            return Path.Join(__static, 'img/icons/icon-tray-Mac.png');
        }
        return Path.Join(__static, 'img/icons/icon-tray.png');
    }
}
