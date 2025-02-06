import { isDev, isMacOS, isWindows } from '@/main/utils/utils'
import path from 'path'
import { APP_NAME } from '@/shared/utils/constant'

export default class GetPath {
    static getDir() {
        if (isDev) {
            return process.cwd()
        } else {
            return path.dirname(this.getExePath())
        }
    }

    /**
     * 返回可执行文件路径，Mac返回路径为 AppName.app/Contents/MacOS/AppName
     * @returns {string}
     */
    static getExePath() {
        if (process.type === 'renderer') {
            if (isWindows){
                return process.execPath
            }else if(isMacOS){
                //Applications/EServer.app/Contents/Frameworks/EServer Helper (Renderer).app/Contents/MacOS/EServer Helper (Renderer)
                return path.join(process.execPath,`../../../../../MacOS/${APP_NAME}`)
            }
            return ''
        } else {
            const { app } = require('electron')
            return app.getPath('exe')
        }
    }

    /**
     * 当系统是macOS时，返回App的Contents目录的路径
     * @returns {string}
     */
    static getContentsDir() {
        if (isMacOS) {
            return path.join(this.getDir(), '..')
        }
        return ''
    }

    static getDevPlatformDir() {
        return path.join(this.getDir(), `extra/${process.platform}`)
    }

    static getHostsPath() {
        if (isWindows) {
            return 'C:\\Windows\\System32\\drivers\\etc\\hosts'
        } else {
            return '/etc/hosts'
        }
    }
}
