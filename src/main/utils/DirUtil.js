import fsPromises from 'fs/promises'
import nodePath from 'path'
import FsUtil from '@/main/utils/FsUtil'

const FileTypeEnum = {
    File: 0,
    Directory: 1
}
export default class DirUtil {
    /**
     * 创建目录和子目录
     * @param path {string}
     * @param options
     * @returns {Promise<string|undefined>}
     */
    static async Create(path, options = { recursive: true }) {
        return await fsPromises.mkdir(path, options)
    }

    static async Delete(path, options = { recursive: true, force: true }) {
        return await FsUtil.Remove(path, options)
    }

    /**
     * 判断目录是否存在
     * @param path {string}
     * @returns {Promise<boolean>}
     */
    static async Exists(path) {
        return await FsUtil.Exists(path)
    }

    /**
     * 获取指定目录中的所有目录路径或包含<fs.Stats>对象
     * @param path {string}
     * @param filter {string|RegExp}
     * @param withStats {boolean}
     * @returns {Promise<string[]|object[]>}
     */
    static async GetDirectories(path, filter = null, withStats = false) {
        return await this.GetAll(path, FileTypeEnum.Directory, filter, withStats)
    }

    /**
     * 获取指定目录中的所有文件路径或包含<fs.Stats>对象
     * @param path {string}
     * @param filter {string|RegExp}
     * @param withStats {boolean}
     * @returns {Promise<string[]|object[]>}
     */
    static async GetFiles(path, filter = null, withStats = false) {
        return await this.GetAll(path, FileTypeEnum.File, filter, withStats)
    }

    /**
     * @param path {string}
     * @param fileType {FileTypeEnum}
     * @param filter {string|RegExp}
     * @param withStats {boolean} true时，返回的数组将包含<fs.Stats>对象
     * @returns {Promise<string[]|object[]>}
     */
    static async GetAll(path, fileType = '', filter = null, withStats = false) {
        let direntArr = await fsPromises.readdir(path, { withFileTypes: true })
        let list = direntArr.filter((dirent) => {
            if (fileType === FileTypeEnum.File && !dirent.isFile()) {
                return false
            } else if (fileType === FileTypeEnum.Directory && !dirent.isDirectory()) {
                return false
            }

            if (filter) {
                if (filter instanceof RegExp) {
                    if (!filter.test(dirent.name)) return false
                } else {
                    if (!dirent.name.includes(filter)) return false
                }
            }
            return true
        })

        const mapFn = async (dirent) => {
            const itemPath = nodePath.join(path, dirent.name)
            if (withStats) {
                const stats = await fsPromises.lstat(itemPath)
                return { path: itemPath, stats }
            }
            return itemPath
        }
        return await Promise.all(list.map(mapFn))
    }
}
