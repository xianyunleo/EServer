export async function getFileIcon(path, options = {}) {
    if (process.type === 'renderer') {
        return (await window.api.call('fileGetIcon', path, options)).toDataURL()
    } else {
        const { app } = require('electron')
        return (await app.getFileIcon(path, options)).toDataURL()
    }
}
