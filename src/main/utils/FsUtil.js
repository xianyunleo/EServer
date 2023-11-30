import fsPromises, { constants } from 'fs/promises'
import { isWindows } from '@/main/utils/utils'
import Command from '@/main/utils/Command'

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
    static async CanReadWrite(path) {
        try {
            await fsPromises.access(path, constants.R_OK | constants.W_OK)
            return true
        } catch {
            return false
        }
    }

    static async ChmodReadWrite(path) {
        if (isWindows) {
            await fsPromises.chmod(path, 0o666)
        } else {
            await Command.sudoExec(`chmod 666 ${path}`)
        }
    }
}
