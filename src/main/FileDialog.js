import {dialog} from '@electron/remote';

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
}


