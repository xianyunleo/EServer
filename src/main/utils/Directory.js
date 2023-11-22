import fs from 'fs'
import fsPromises from 'fs/promises'
import nodePath from 'path'

const FileTypeEnum = {
    File: 0,
    Directory: 1
}
export default class Directory {
    /**
     * 创建目录和子目录
     * @param path {string}
     * @returns {string|undefined}
     */
    static CreateDirectory(path) {
        const options = {
            recursive: true
        }
        return fs.mkdirSync(path, options)
    }

    /**
     * 创建目录符号链接
     * @param path {string}
     * @param pathToTarget {string}
     * @returns {undefined}
     */
    static CreateSymbolicLink(path, pathToTarget) {
        return fs.symlinkSync(pathToTarget, path)
    }

    /**
     * 删除目录
     * @param path {string}
     * @param options {object}
     * @returns {Promise<undefined>}
     */
    static async Delete(path, options = { recursive: true, force: true }) {
        return await fsPromises.rm(path, options)
    }

    /**
     * 判断目录是否存在
     * @param path {string}
     * @returns {boolean}
     */
    static Exists(path) {
        return fs.existsSync(path) && fs.lstatSync(path).isDirectory()
    }

    /**
     * 将现有目录移动到新目录
     * @param source {string}
     * @param dest {string}
     * @returns {undefined}
     */
    static Move(source, dest) {
        return fs.renameSync(source, dest)
    }

    /**
     * 将现有目录复制到新目录
     * @param source {string}
     * @param dest {string}
     * @param options {object}
     * @returns {void}
     */
    static Copy(source, dest, options) {
        return fs.cpSync(source, dest, options)
    }

    /**
     * 获取指定目录中的所有目录名（包含其路径）
     * @param path {string}
     * @param search {string|RegExp}
     * @returns {string[]}
     */
    static GetDirectories(path, search = null) {
        return this.GetAll(path, FileTypeEnum.Directory, search)
    }

    /**
     * 获取指定目录中的所有文件名（包含其路径）
     * @param path {string}
     * @param search {string|RegExp}
     * @returns {string[]}
     */
    static GetFiles(path, search = null) {
        return this.GetAll(path, FileTypeEnum.File, search)
    }

    /**
     * 获取指定目录中的所有文件名（包含其路径）
     * @param path {string}
     * @param fileType {FileTypeEnum}
     * @param search {string|RegExp}
     * @returns {string[]}
     */
    static GetAll(path, fileType = '', search = null) {
        let dirents = fs.readdirSync(path, { withFileTypes: true })
        let list = []
        for (const dirent of dirents) {
            if (fileType === FileTypeEnum.File && !dirent.isFile()) {
                continue
            } else if (fileType === FileTypeEnum.Directory && !dirent.isDirectory()) {
                continue
            }

            if (search) {
                if (search instanceof RegExp) {
                    if (dirent.name.search(search) === -1) continue
                } else {
                    if (!dirent.name.includes(search)) continue
                }
            }
            list.push(nodePath.join(path, dirent.name))
        }
        return list
    }
}
