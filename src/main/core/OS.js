import * as os from "os";
import is from "electron-is";

export default class OS {
    static #_isMacOSLowVersion = null;
    static #_majorVersion = null;
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
        this.#_majorVersion = this.#_majorVersion ? this.#_majorVersion : Number(this.getVersion().split('.')[0]);
        return this.#_majorVersion;
    }

    static getUserName() {
        return os.userInfo().username;
    }

    static isMacOS() {
        return is.macOS();
    }

    static isWindows() {
        return is.windows();
    }

    static isMacOSLowVersion() {
        if (OS.#_isMacOSLowVersion != null) {
            return OS.#_isMacOSLowVersion;
        }

        if (OS.isMacOS()) {
            let mainVersion = OS.getVersion().split('.')[0];
            //https://en.wikipedia.org/wiki/Darwin_(operating_system)
            //<=macOS 10.13 High Sierra
            if (Number(mainVersion) <= 17) {
                OS.#_isMacOSLowVersion = true;
                return true;
            }
        }
        OS.#_isMacOSLowVersion = false;
        return false;
    }
}
