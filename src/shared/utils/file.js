export async function getFileIcon(path, options = {}) {
    if (process.type === 'renderer') {
        const Ipc = (await import('@/renderer/utils/Ipc')).default
        return (await Ipc.call('fileGetIcon', path, options)).toDataURL()
    } else {
        const { app } = require('electron')
        return (await app.getFileIcon(path, options)).toDataURL()
    }
}
