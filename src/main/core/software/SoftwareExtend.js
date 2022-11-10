import GetPath from "@/shared/utils/GetPath";
import Directory from "@/main/utils/Directory";
import Path from "@/main/utils/Path";


export default class SoftwareExtend {
    /**
     *
     * @returns {*[]|{name: string, version: string}[]}
     */
    static getPHPList() {
        let path = GetPath.getPhpTypePath();
        if (!Directory.Exists(path)) {
            return [];
        }
        let list = Directory.GetDirectories(path, 'php-');

        return list.map(path => {
            let name = Path.GetBaseName(path);
            let version = SoftwareExtend.getPHPVersion(name);
            return {version, name};
        });
    }

    /**
     *
     * @returns {*[]|{name: string, version: string}[]}
     */
    static getMySQLList() {
        let path = GetPath.getServerTypePath();
        if (!Directory.Exists(path)) {
            return [];
        }
        let list = Directory.GetDirectories(path, 'mysql-');

        return list.map(path => {
            let name = Path.GetBaseName(path);
            let version = SoftwareExtend.getMysqlVersion(name);
            return {version, name};
        });
    }

    /**
     *
     * @param dirName {string}
     * @returns {string|null}
     */
    static getPHPVersion(dirName) {
        let matches = dirName.match(/php-(.+)/);
        return matches ? matches[1] : null;
    }

    /**
     *
     * @param dirName {string}
     * @returns {string|null}
     */
    static getMysqlVersion(dirName) {
        let matches = dirName.match(/mysql-(.+)/);
        return matches ? matches[1] : null;
    }

}
