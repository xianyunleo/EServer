/* global __static */
import {Tray, Menu, nativeImage} from 'electron'
import Path from "@/main/utils/Path";

export default class TrayManager {
    static init(){
        let iconPath = Path.Join(__static,'img/icons/icon-Mac-tray.png');
        let icon = nativeImage.createFromPath(iconPath).resize({width:18,height:18})
        let tray = new Tray(icon);
        const contextMenu = Menu.buildFromTemplate([
            { label: 'Item1', type: 'radio' },
            { label: 'Item2', type: 'radio' },
            { label: 'Item3', type: 'radio', checked: true },
            { label: 'Item4', type: 'radio' }
        ])
        tray.setToolTip('This is my application.')
        tray.setContextMenu(contextMenu)
    }
}
