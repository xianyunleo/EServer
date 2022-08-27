import GetPath from "@/shared/utils/GetPath";
import {fsExists, getDirsByDir} from "@/main/utils/utils";


export default class SoftwareExtend {
    static async getPHPVersionList() {
        let path = GetPath.getPHPTypePath();
        if (!fsExists(path)) {
            return [];
        }
        let list = getDirsByDir(path, 'php-');

        return await Promise.all(list.map(async item => {
            let matches = item.match(/php-(.+)/);
            if (!matches) {
                return false;
            }
            return {version: matches[1], name: matches[0]};
        }));
    }

    static async getMySQLVersionList() {
        let path = GetPath.getServerTypePath();
        if (!fsExists(path)) {
            return [];
        }
        let list = getDirsByDir(path, 'mysql-');

        return await Promise.all(list.map(async item => {
            let matches = item.match(/mysql-(.+)/);
            if (!matches) {
                return false;
            }
            return {version: matches[1], name: matches[0]};
        }));
    }
}