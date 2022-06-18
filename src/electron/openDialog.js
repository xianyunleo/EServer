import {dialog} from '@electron/remote'

export function openDirectoryDialog(defaultPath = null) {
    let options = {
        properties: ['openDirectory']
    };
    if (defaultPath) {
        options.defaultPath = defaultPath;
    }
    return dialog.showOpenDialogSync(options)
}