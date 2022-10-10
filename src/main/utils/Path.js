import nodePath from "path";

export default class Path {

    /**
     * 获取文件名
     * @param path {string}
     * @returns {string|null}
     */
    static GetFileName(path) {
        return nodePath.parse(path)?.base;
    }

    /**
     * 获取文件名，不带扩展名
     * @param path {string}
     * @returns {string|null}
     */
    static GetFileNameWithoutExtension(path) {
        return nodePath.parse(path)?.name;
    }

    /**
     * 获取文件扩展名
     * @param path {string}
     * @returns {string|null}
     */
    static GetExtension(path) {
        return nodePath.parse(path)?.ext;
    }

    /**
     * 获取目录名
     * @param path {string}
     * @returns {string|null}
     */
    static GetDirectoryName(path) {
        return nodePath.parse(path)?.dir;
    }

    static Combine(...path) {
        return nodePath.resolve(...path);
    }

    static Join(...path) {
        return nodePath.join(...path);
    }

}
