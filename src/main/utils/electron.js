
export function electronRequire(module) {
    if (process.type === 'renderer') {
        return require('@electron/remote')[module]
    } else {
        return require('electron')[module]
    }
}

export function electronRequireMulti() {
    if (process.type === 'renderer') {
        return require('@electron/remote')
    } else {
        return require('electron')
    }
}
