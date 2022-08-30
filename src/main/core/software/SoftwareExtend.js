import GetPath from "@/shared/utils/GetPath";
import {fsExists, getDirsByDir} from "@/main/utils/utils";


export default class SoftwareExtend {
    /**
     *
     * @returns {*[]|{name: string, version: string}[]}
     */
    static getPHPList() {
        let path = GetPath.getPHPTypePath();
        if (!fsExists(path)) {
            return [];
        }
        let list = getDirsByDir(path, 'php-');

        return list.map(name => {
            let matches = name.match(/php-(.+)/);
            return {version: matches[1], name: name};
        });
    }

    /**
     *
     * @returns {*[]|{name: string, version: string}[]}
     */
    static getMySQLList() {
        let path = GetPath.getServerTypePath();
        if (!fsExists(path)) {
            return [];
        }
        let list = getDirsByDir(path, 'mysql-');

        return list.map(name => {
            let matches = name.match(/mysql-(.+)/);
            return {version: matches[1], name: name};
        });
    }
}