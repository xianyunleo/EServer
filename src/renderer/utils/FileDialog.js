import {dialog} from '@electron/remote';
import is from "electron-is";

export default class FileDialog {
    static showOpenDirectory(defaultPath = null) {
        let options = {
            properties: ['openDirectory']
        }
        if (defaultPath) {
            options.defaultPath = defaultPath;
        }
        let res = dialog.showOpenDialogSync(options);
        return res ? res[0] : null;
    }

    static showOpenFile(defaultPath = null) {
        let options = {
            properties: ['openFile']
        }
        if (defaultPath) {
            options.defaultPath = defaultPath;
        }
        let res = dialog.showOpenDialogSync(options);
        return res ? res[0] : null;
    }

    static showOpenApp(defaultPath = null) {
        let filters;
        if (is.windows()) {
            filters = [{name: '应用程序', extensions: ['exe']}];
        }
        if (is.macOS()) {
            filters = [{name: '应用程序', extensions: ['app']}];
        }
        let options = {
            properties: ['openFile'],
            filters: filters
        }
        if (defaultPath) {
            options.defaultPath = defaultPath;
        }
        let res = dialog.showOpenDialogSync(options);
        return res ? res[0] : null;
    }
}


