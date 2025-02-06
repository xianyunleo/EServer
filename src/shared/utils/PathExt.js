import nodePath from 'path'

export default class PathExt {
    /**
     * 获取文件名，不带扩展名
     * @param path {string}
     * @returns {string}
     */
    static GetFileNameWithoutExt(path) {
        return nodePath.parse(path).name
    }
}
