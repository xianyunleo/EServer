import fsPromises, { constants } from 'fs/promises'
import { isWindows } from '@/main/utils/utils'
import Shell from '@/main/utils/Shell'
import nodePath from 'path'

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

    static async Delete(path, options = { force: true, recursive: true }) {
        return await FsUtil.Remove(path, options)
    }

    static async Remove(path, options = {}) {
        return await fsPromises.rm(path, options)
    }

    static FixSymbolicLinkPath(path) {
        if (!isWindows) {
            //Linux symlink 路径哪怕是目录，结尾也不能带/。否则创建符号链接规则变了 或 无法解析获得目标路径
            path = path?.replace(/\/$/, '')
        }
        return path;
    }

    /**
     * 创建符号链接。Windows需要管理员权限
     * @param path {string} 符号链接的路径
     * @param pathToTarget {string} 符号链接指向的目标的路径
     * @returns {undefined}
     */
    static async CreateSymbolicLink(path, pathToTarget) {
        path = FsUtil.FixSymbolicLinkPath(path)

        const stats = await fsPromises.stat(pathToTarget)
        const type = stats.isDirectory() ? 'dir' : 'file'
        return await fsPromises.symlink(pathToTarget, path, type)
    }

    static async IsSymbolicLink(path) {
        path = FsUtil.FixSymbolicLinkPath(path)
        const stats = await fsPromises.lstat(path)
        return stats.isSymbolicLink()
    }

    static async ParseSymbolicLink(path) {
        if (!await FsUtil.Exists(path)) {
            return path
        }
        if (await FsUtil.IsSymbolicLink(path)) {
            const target = await fsPromises.readlink(path)
            if (nodePath.isAbsolute(target)) {
                return target
            }
            return nodePath.resolve(nodePath.dirname(path), target)
        } else {
            return path
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
            await Shell.sudoExec(`chmod 666 ${path}`)
        }
    }
}
