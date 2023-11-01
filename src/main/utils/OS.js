import os from 'os'
import process from 'process'

export default class OS {
    static #_majorVersion = null

    /**
     * 获取系统版本号字符串，Windows如10.0.19045
     * @returns {string}
     */
    static getVersion() {
        return os.release()
    }

    /**
     * 获取系统主要版本号，Windows如10
     * @returns {number}
     */
    static getMajorVersion() {
        this.#_majorVersion = this.#_majorVersion ? this.#_majorVersion : Number(this.getVersion().split('.')[0])
        return this.#_majorVersion
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
}
