import fsPromises, { constants } from 'fs/promises'
import { isWindows } from '@/main/utils/utils'
import Shell from '@/main/utils/Shell'

export default class FsUtil {
    /**
     *
     * @param path {string}
     * @returns {Promise<boolean>}
     */
    static async Exists(path) {
        try {
            await fsPromises.access(path)
            return true
        } catch {
            return false
        }
    }

    static async Copy(source, dest, options = {}) {
        return await fsPromises.cp(source, dest, options)
    }

    static async Rename(oldPath, newPath) {
        return await fsPromises.rename(oldPath, newPath)
    }

    static async Remove(path, options = {}) {
        return await fsPromises.rm(path, options)
    }

    /**
     * 创建符号链接。Windows需要管理员权限
     * @param path {string} 符号链接的路径
     * @param pathToTarget {string} 符号链接指向的目标的路径
     * @returns {undefined}
     */
    static async CreateSymbolicLink(path, pathToTarget) {
        return await fsPromises.symlink(pathToTarget, path)
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
            await Shell.sudoExec(`chmod 666 ${path}`)
        }
    }
}
