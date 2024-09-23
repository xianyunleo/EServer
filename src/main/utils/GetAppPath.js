import { isDev, isMacOS, isWindows } from '@/main/utils/utils'
import {
    INIT_FILE_NAME,
    MAC_CORE_PATH_NAME,
    MAC_USER_CORE_DIR,
    WIN_CORE_PATH_NAME
} from '@/main/utils/constant'
import Path from '@/main/utils/Path'

export default class GetAppPath {
    static getDir() {
        if (isDev) {
            return process.cwd()
        } else {
            return Path.GetDirName(this.getExePath())
        }
    }

    /**
     * 返回可执行文件路径，Mac返回路径为 AppName.app/Contents/MacOS/AppName
     * @returns {string}
     */
    static getExePath() {
        return process.execPath //同app.getPath('exe')
    }

    /**
     * 获取App核心目录
     * @returns {string}
     */
    static getCoreDir() {
        let result = ''
        if (isWindows) {
            if (isDev) {
                result = Path.Join(this.getDevPlatformDir(), WIN_CORE_PATH_NAME)
            } else {
                result = Path.Join(this.getDir(), WIN_CORE_PATH_NAME)
            }
        } else if (isMacOS) {
            if (isDev) {
                result = Path.Join(this.getDevPlatformDir(), MAC_CORE_PATH_NAME)
            } else {
                result = Path.Join(this.getContentsDir(), MAC_CORE_PATH_NAME)
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
            return Path.Join(this.getDir(), '..')
        }
        return ''
    }

    static getSettingsDir() {
        return this.getUserCoreDir()
    }

    static getDevPlatformDir() {
        return Path.Join(this.getDir(), `extra/${process.platform}`)
    }

    static getInitFilePath() {
        return Path.Join(this.getCoreDir(), INIT_FILE_NAME)
    }
}
