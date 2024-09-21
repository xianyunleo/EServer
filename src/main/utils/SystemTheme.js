export default class SystemTheme {
    static isDarkModel() {
        if (process.type === 'renderer') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches
        } else {
            const { nativeTheme } = require('electron')
            return nativeTheme.shouldUseDarkColors
        }
    }
}
