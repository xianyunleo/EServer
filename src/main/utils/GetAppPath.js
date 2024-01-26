import { isDev, isMacOS, isWindows } from '@/main/utils/utils'
import path from 'path'
import { electronRequire } from '@/main/utils/electron'
import {
    INIT_FILE_NAME,
    MAC_CORE_PATH_NAME,
    MAC_USER_CORE_DIR,
    WIN_CORE_PATH_NAME
} from '@/main/utils/constant'

const app = electronRequire('app')

export default class GetAppPath {
    static getDir() {
        if (isDev) {
            return app.getAppPath()
        } else {
            return path.dirname(this.getExePath())
        }
    }

    /**
     * 返回可执行文件路径，Mac返回路径为 AppName.app/Contents/MacOS/AppName
     * @returns {string}
     */
    static getExePath() {
        return app.getPath('exe')
    }

    /**
     * 获取App核心目录
     * @returns {string}
     */
    static getCoreDir() {
        let result = ''
        if (isWindows) {
            if (isDev) {
                result = path.join(this.getDevPlatformDir(), WIN_CORE_PATH_NAME)
            } else {
                result = path.join(this.getDir(), WIN_CORE_PATH_NAME)
            }
        } else if (isMacOS) {
            if (isDev) {
                result = path.join(this.getDevPlatformDir(), MAC_CORE_PATH_NAME)
            } else {
                result = path.join(this.getContentsDir(), MAC_CORE_PATH_NAME)
            }
        }
        return result
    }

    /**
     * 获取便于用户操作的核心目录
     * @returns {string}
     */
    static getUserCoreDir() {
        if (isMacOS && !isDev) {
            return MAC_USER_CORE_DIR
        }
        return this.getCoreDir()
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

    static getSettingsDir() {
        return this.getUserCoreDir()
    }

    static getFrontEndDir() {
        return app.getAppPath()
    }

    static getStaticDir() {
        //这里的resources是指项目resources目录，非electron resources目录
        return path.join(this.getFrontEndDir(), 'resources')
    }

    static getDevPlatformDir() {
        return path.join(this.getDir(), `extra/${process.platform}`)
    }

    static getInitFilePath() {
        return path.join(this.getCoreDir(), INIT_FILE_NAME)
    }
}
