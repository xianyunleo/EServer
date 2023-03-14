import {dialog} from '@electron/remote';
import OS from "@/main/core/OS";

export default class FileDialog {
    static showOpenDirectory(defaultPath = null) {
        let options = {
            properties: ['openDirectory']
        }
        if (defaultPath) {
            if (OS.isWindows()) {
                defaultPath = defaultPath.replaceAll("/", "\\");
            }
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
        if (OS.isWindows()) {
            filters = [{name: '应用程序', extensions: ['exe']}];
        }
        if (OS.isMacOS()) {
            filters = [{name: '应用程序', extensions: ['app']}];
        }
        let options = {
            properties: ['openFile'],
            filters: filters
        }
        if (defaultPath) {
            options.defaultPath = defaultPath;
        }else {
            if(OS.isMacOS()){
                options.defaultPath = '/Applications';
            }
        }
        let res = dialog.showOpenDialogSync(options);
        return res ? res[0] : null;
    }
}


