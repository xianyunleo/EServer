import GetPath from "@/shared/utils/GetPath";
import File from "@/main/utils/File";
import Path from "@/main/utils/Path";
import OS from "@/main/core/OS";
import SoftwareExtend from "@/main/core/software/SoftwareExtend";
import StringExtend from "@/main/core/baseClass/StringExtend";

export default class SoftwareInit extends StringExtend{
    static {
        super.init();
    }
    static async initAll() {
        if(!OS.isWindows()){
            return;
        }
        await Promise.all([
            this.initNginxPath(),
            this.initAllPHPIni(),
            this.initAllMySQLIni()
        ]);
    }

    static async initNginxPath() {
        try {
            let path = Path.Join(GetPath.getNginxConfPath(), 'nginx.conf');
            let text = File.ReadAllText(path);
            let pattern = /root\s+\S+\s*;/g;
            let wwwPath = Path.Join(GetPath.getNginxPath(), 'html').replaceSlash();
            let replaceStr = `root ${wwwPath};`;
            text = text.replaceAll(pattern, replaceStr);

            File.WriteAllText(path, text);

            this.initNginxLocalhostPath();
        } catch (error) {
            throw new Error(`初始化Nginx配置失败！${error.message}`);
        }
    }

    static initNginxLocalhostPath() {
        let path = Path.Join(GetPath.getNginxVhostsPath(), 'localhost.conf');
        if (File.Exists(path)) {
            let text = File.ReadAllText(path);
            let pattern = /root\s+\S+\s*;/g;
            let localhostWWWPath = Path.Join(GetPath.getWebsitePath(), 'localhost').replaceSlash();
            let replaceStr = `"root ${localhostWWWPath};`;
            text = text.replaceAll(pattern, replaceStr);
            File.WriteAllText(path, text);
        }
    }

    static async initAllPHPIni() {
        let phpList = SoftwareExtend.getPHPList();

        for (const item of phpList) {
            this.initPHPIni(item.version);
        }
    }

    static initPHPIni(version) {
        try {
            let confPath = Path.Join(GetPath.getPhpPath(version), 'php.ini');
            let text = File.ReadAllText(confPath);
            let phpTempPath = Path.Join(GetPath.geTempPath(), 'php');

            //(?<=\n)upload_tmp_dir\s*=\s*.+
            let uploadPattern = /(?<=\n)upload_tmp_dir\s*=\s*.+/g;

            let replaceUploadStr = `upload_tmp_dir = "${phpTempPath.replaceSlash()}"`;
            text = text.replaceAll(uploadPattern, replaceUploadStr);

            //(?<=\n)session.save_path\s*=\s*.+
            let sessionPattern = /(?<=\n)session.save_path\s*=\s*.+/g;
            let replaceSessionStr = `session.save_path = "${phpTempPath.replaceSlash()}"`;
            text = text.replaceAll(sessionPattern, replaceSessionStr);

            File.WriteAllText(confPath, text);
        } catch (error) {
            throw new Error(`初始化PHP配置失败！${error.message}`);
        }
    }

    static async initAllMySQLIni() {
        let mysqlList = SoftwareExtend.getMySQLList();

        for (const item of mysqlList) {
            this.initMySQLIni(item.version);
        }
    }

    static initMySQLIni(version) {
        try {
            let confPath = Path.Join(GetPath.getMysqlPath(version), 'my.ini');
            let text = File.ReadAllText(confPath);
            let mysqlPath = GetPath.getMysqlPath(version);

            //(?<=\n)basedir\s*=\s*.+
            let basePattern = /(?<=\n)basedir\s*=\s*.+/g;
            let replaceBaseStr = `basedir = "${mysqlPath.replaceSlash()}"`;
            text = text.replaceAll(basePattern, replaceBaseStr);

            //(?<=\n)datadir\s*=\s*.+
            let dataPattern = /(?<=\n)datadir\s*=\s*.+/g;
            let dataPath = GetPath.getMysqlDataPath(version);
            let replaceDataStr = `datadir = "${dataPath.replaceSlash()}"`;
            text = text.replaceAll(dataPattern, replaceDataStr);

            //(?<=\n)log-error\s*=\s*.+
            let logPattern = /(?<=\n)log-error\s*=\s*.+/g;
            let logPath = Path.Join(mysqlPath, 'logs', 'mysql.log');
            let replaceLogStr = `log-error = "${logPath.replaceSlash()}"`;
            text = text.replaceAll(logPattern, replaceLogStr);

            File.WriteAllText(confPath, text);
        } catch (error) {
            throw new Error(`初始化MySQL配置失败！${error.message}`);
        }
    }

}
