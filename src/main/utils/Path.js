import nodePath from "path";

export default class Path {

    /**
     * 获取目录的最后一部分
     * @param path {string}
     * @returns {string}
     */
    static GetBaseName(path) {
        return nodePath.basename(path);
    }

    /**
     * 获取文件名，不带扩展名
     * @param path {string}
     * @returns {string}
     */
    static GetFileNameWithoutExtension(path) {
        return nodePath.parse(path).name;
    }

    /**
     * 获取文件扩展名
     * @param path {string}
     * @returns {string}
     */
    static GetExtension(path) {
        return nodePath.extname(path);
    }

    /**
     * 获取目录名
     * @param path {string}
     * @returns {string}
     */
    static GetDirectoryName(path) {
        return nodePath.dirname(path);
    }

    static Combine(...path) {
        return nodePath.resolve(...path);
    }

    static Join(...path) {
        return nodePath.join(...path);
    }

}
