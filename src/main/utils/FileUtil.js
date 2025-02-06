import fsPromises from 'fs/promises'
import FsUtil from '@/main/utils/FsUtil'

export default class FileUtil {
    static async Delete(path, options = { force: true }) {
        return await FsUtil.Remove(path, options)
    }

    /**
     * 判断文件是否存在
     * @param path {string}
     * @returns {Promise<boolean>}
     */
    static async Exists(path) {
        return await FsUtil.Exists(path)
    }

    /**
     * 将文件移动到新位置，如果文件存在，则覆盖
     * @param oldPath {string}
     * @param newPath {string}
     * @returns {Promise<undefined>}
     */
    static async Move(oldPath, newPath) {
        return await FsUtil.Rename(oldPath, newPath)
    }

    static async Copy(source, dest) {
        return await fsPromises.copyFile(source, dest)
    }

    /**
     * 读取文件的全部内容
     * @param path {string}
     * @param options
     * @returns {Promise<string|Buffer>}
     */
    static async ReadAll(path, options = { encoding: 'utf8' }) {
        return await fsPromises.readFile(path, options)
    }

    /**
     * 创建一个新文件，将数据写入该文件，如果文件已经存在，则会覆盖该文件。
     * @param path {string}
     * @param data
     * @param options
     * @returns {Promise<undefined>}
     */
    static async WriteAll(path, data, options = {}) {
        return await fsPromises.writeFile(path, data, options)
    }

    /**
     * 将数据追加到文件，如果文件不存在，则会创建该文件。
     * @param path {string}
     * @param data
     * @param options
     * @returns {Promise<undefined>}
     */
    static async Append(path, data, options = {}) {
        return await fsPromises.appendFile(path, data, options)
    }
}
