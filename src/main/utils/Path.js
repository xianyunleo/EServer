import nodePath from 'path'

export default class Path {
    /**
     * 获取目录的最后一部分
     * @param path {string}
     * @returns {string}
     */
    static GetBaseName(path) {
        return nodePath.basename(path)
    }

    /**
     * 获取文件名，不带扩展名
     * @param path {string}
     * @returns {string}
     */
    static GetFileNameWithoutExt(path) {
        return nodePath.parse(path).name
    }

    /**
     * 获取文件扩展名
     * @param path {string}
     * @returns {string}
     */
    static GetExt(path) {
        return nodePath.extname(path)
    }

    /**
     * 获取目录名
     * @param path {string}
     * @returns {string}
     */
    static GetDirName(path) {
        return nodePath.dirname(path)
    }

    static Resolve(...path) {
        return nodePath.resolve(...path)
    }

    static Combine(...path) {
        return this.Resolve(...path)
    }

    static Join(...path) {
        return nodePath.join(...path)
    }
}
