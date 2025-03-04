import GetDataPath from "@/shared/utils/GetDataPath";
import DirUtil from "@/main/utils/DirUtil";
import nodePath from 'path'
import FileUtil from "@/main/utils/FileUtil";

export default class ChildAppExtend {
    /**
     * 获取Nginx网站配置的PHP版本号列表，如['7.4','8.0']
     * @returns {Promise<string[]|*[]>}
     */
    static async getNginxRequirePhpList() {
        let nginxVhostsPath = GetDataPath.getNginxVhostsDir()
        let vhosts = await DirUtil.GetFiles(nginxVhostsPath, '.conf');
        if (!vhosts || vhosts.length === 0) {
            return [];
        }
        //获取所有网站PHP版本数组，并发读文件并匹配PHP版本
        let phpVersionList = await Promise.all(vhosts.map(async confPath => {
            let text = await FileUtil.ReadAll(confPath);
            let matches = text.match(/php-(\S+?)\.conf/);
            return matches ? matches[1] : null;
        }));

        phpVersionList = new Set(phpVersionList); //去重
        phpVersionList = Array.from(phpVersionList).filter(item => item !== null);
        return phpVersionList;
    }

    static async getPHPList() {
        let path = GetDataPath.getPhpTypeDir()
        if (!await DirUtil.Exists(path)) {
            return [];
        }
        let list = await DirUtil.GetDirectories(path, 'php-');

        return list.map(path => {
            let name = nodePath.basename(path);
            let version = ChildAppExtend.getPHPVersion(name);
            return { version, name };
        });
    }

    static async getMySQLList() {
        let path = GetDataPath.getServerTypeDir()
        if (!await DirUtil.Exists(path)) {
            return [];
        }
        let list = await DirUtil.GetDirectories(path, 'mysql-');

        return list.map(path => {
            let name = nodePath.basename(path);
            let version = ChildAppExtend.getMysqlVersion(name);
            return { version, name };
        });
    }

    /**
     *
     * @param name {string}
     * @returns {string|null}
     */
    static getPHPVersion(name) {
        let matches = name.match(/php-([\d.]+)/i)
        return matches ? matches[1] : null
    }

    /**
     *
     * @param name {string}
     * @returns {string|null}
     */
    static getMysqlVersion(name) {
        let matches = name.match(/mysql-([\d.]+)/i)
        return matches ? matches[1] : null
    }

    static getPhpName(phpVersion) {
        return `PHP-${phpVersion}`
    }
}
