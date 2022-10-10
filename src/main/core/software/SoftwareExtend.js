import GetPath from "@/shared/utils/GetPath";
import File from "@/main/utils/File";
import Directory from "@/main/utils/Directory";
import Path from "@/main/utils/Path";


export default class SoftwareExtend {
    /**
     *
     * @returns {*[]|{name: string, version: string}[]}
     */
    static getPHPList() {
        let path = GetPath.getPHPTypePath();
        if (!File.Exists(path)) {
            return [];
        }
        let list = Directory.GetDirectories(path, 'php-');

        return list.map(path => {
            let name = Path.GetFileName(path);
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
        if (!Directory.Exists(path)) {
            return [];
        }
        let list = Directory.GetDirectories(path, 'mysql-');

        return list.map(path => {
            let name = Path.GetFileName(path);
            let matches = name.match(/mysql-(.+)/);
            return {version: matches[1], name: name};
        });
    }
}
