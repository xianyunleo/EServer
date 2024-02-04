import { getCurrentWindow as getCurrentWindowByRemote } from '@electron/remote'

export function getCurrentWindow() {
    return getCurrentWindowByRemote()
}

export function switchMaximize(mainWindow) {
    if (mainWindow.isMaximized()) {
        mainWindow.unmaximize()
    } else {
        mainWindow.maximize()
    }
}
