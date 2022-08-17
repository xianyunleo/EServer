import {dialog} from '@electron/remote'

export function openDirectoryDialog(defaultPath = null) {
    let options = {
        properties: ['openDirectory']
    };
    if (defaultPath) {
        options.defaultPath = defaultPath;
    }
    let res = dialog.showOpenDialogSync(options)
    return res ? res[0] : undefined;
}
