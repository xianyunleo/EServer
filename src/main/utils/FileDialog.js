import { electronRequire } from '@/main/utils/electron'
import { isMacOS, isWindows } from '@/main/utils/utils'

const dialog = electronRequire('dialog')

export default class FileDialog {
    static showOpenDirectory(defaultPath = null) {
        let options = {
            properties: ['openDirectory']
        }
        if (defaultPath) {
            if (isWindows) {
                defaultPath = defaultPath.replaceAll("/", "\\");
            }
            options.defaultPath = defaultPath;
        }
        let res = dialog.showOpenDialogSync(options);
        return res ? res[0] : null;
    }

    static showOpenFile(defaultPath = null, filters = []) {
        let options = {
            properties: ['openFile'],
            filters
        }
        if (defaultPath) {
            options.defaultPath = defaultPath
        }
        let res = dialog.showOpenDialogSync(options)
        return res ? res[0] : null
    }

    static showOpenApp(defaultPath = null) {
        let filters;
        if (isWindows) {
            filters = [{name: '应用程序', extensions: ['exe']}];
        }
        if (isMacOS) {
            filters = [{name: '应用程序', extensions: ['app']}];
        }
        let options = {
            properties: ['openFile'],
            filters: filters
        }
        if (defaultPath) {
            options.defaultPath = defaultPath;
        }else {
            if(isMacOS){
                options.defaultPath = '/Applications';
            }
        }
        let res = dialog.showOpenDialogSync(options);
        return res ? res[0] : null;
    }
}


