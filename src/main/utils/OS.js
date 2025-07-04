import os from 'os'
import process from 'process'
import { PowerShell } from '@/main/utils/constant'
import { isWindows } from '@/main/utils/utils'
import util from 'util'
import child_process from 'child_process'

export default class OS {
    static _version = null
    static _majorVersion = null
    static _simpleLanguage = null

    /**
     * 获取系统版本号字符串，Windows如10.0.19045
     * @returns {string}
     */
    static getVersion() {
        this._version = this._version ? this._version : os.release()
        return this._version
    }

    /**
     * 获取系统主要版本号，Windows如10
     * @returns {number}
     */
    static getMajorVersion() {
        this._majorVersion = this._majorVersion ? this._majorVersion : Number(this.getVersion().split('.')[0])
        return this._majorVersion
    }

    static getHomeDir() {
        return os.homedir()
    }

    static getUserName() {
        return os.userInfo().username
    }

    static isMacOS() {
        return process.platform === 'darwin'
    }

    static isWindows() {
        return process.platform === 'win32'
    }

    /**
     * 获取系统当前的语言，如zh、en等；
     * @returns {Promise<string>}
     */
    static async getSimpleLanguage() {
        if (this._simpleLanguage) return this._simpleLanguage
        if (isWindows) {
            this._simpleLanguage = await this.getSimpleLanguageForWindows()
        }
        return this._simpleLanguage
    }


    static async getSimpleLanguageForWindows() {
        const exec = util.promisify(child_process.exec)
        try {
            const { stdout } = await exec('(Get-Culture).TwoLetterISOLanguageName', { shell: PowerShell })
            return stdout.trim()
        } catch (error) {
            return ''
        }
    }
}
