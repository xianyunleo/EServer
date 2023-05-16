import fs from "fs";
import nodePath from "path";

export default class Directory {

    /**
     * 创建目录和子目录
     * @param path {string}
     * @returns {string|undefined}
     */
    static CreateDirectory(path) {
        const options = {
            recursive: true
        };
        return fs.mkdirSync(path, options);
    }

    /**
     * 创建目录符号链接
     * @param path {string}
     * @param pathToTarget {string}
     * @returns {undefined}
     */
    static CreateSymbolicLink(path, pathToTarget) {
        return fs.symlinkSync(pathToTarget, path);
    }

    /**
     * 删除目录
     * @param path {string}
     * @param recursive {boolean} 递归删除子目录和文件
     * @returns {undefined}
     */
    static Delete(path, recursive = true) {
        const options = {
            recursive: recursive
        };
        return fs.rmdirSync(path, options);
    }

    /**
     * 判断目录是否存在
     * @param path {string}
     * @returns {boolean}
     */
    static Exists(path) {
        return fs.existsSync(path) && fs.lstatSync(path).isDirectory();
    }

    /**
     * 将现有目录移动到新目录
     * @param source {string}
     * @param dest {string}
     * @returns {undefined}
     */
    static Move(source, dest) {
        return fs.renameSync(source, dest);
    }

    /**
     * 将现有目录复制到新目录
     * @param source {string}
     * @param dest {string}
     * @param options {object}
     * @returns {void}
     */
    static Copy(source, dest, options) {
        return fs.cpSync(source, dest, options);
    }

    /**
     * 获取指定目录中的所有目录名（包含其路径）
     * @param path {string}
     * @param searchString {string}
     * @returns {string[]}
     */
    static GetDirectories(path, searchString) {
        let dirents = fs.readdirSync(path, {withFileTypes: true});
        let list = [];
        for (const dirent of dirents) {
            if (!dirent.isDirectory()) {
                continue;
            }
            if (searchString && !dirent.name.includes(searchString)) {
                continue;
            }
            list.push(nodePath.join(path, dirent.name));
        }
        return list;
    }

    /**
     * 获取指定目录中的所有文件名（包含其路径）
     * @param path {string}
     * @param searchString {string}
     * @returns {string[]}
     */
    static GetFiles(path, searchString) {
        let dirents = fs.readdirSync(path, {withFileTypes: true});
        let list = [];
        for (const dirent of dirents) {
            if (!dirent.isFile()) {
                continue;
            }
            if (searchString && !dirent.name.includes(searchString)) {
                continue;
            }
            list.push(nodePath.join(path, dirent.name));
        }
        return list;
    }
}
