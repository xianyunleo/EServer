import fsPromises, { constants } from 'fs/promises'

export default class FsUtil {
    /**
     *
     * @param path {string}
     * @returns {Promise<boolean>}
     */
    static async Exists(path) {
        try {
            await fsPromises.access(path, constants.F_OK)
            return true
        } catch {
            return false
        }
    }

    /**
     *
     * @param path {string}
     * @returns {Promise<boolean>}
     */
    static async AccessReadAndWrite(path) {
        try {
            await fsPromises.access(path, constants.R_OK | constants.W_OK)
            return true
        } catch {
            return false
        }
    }
}
