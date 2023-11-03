import GetPath from "@/shared/utils/GetPath";
import File from "@/main/utils/File";
import Path from "@/main/utils/Path";
import SoftwareExtend from "@/main/core/software/SoftwareExtend";
import StringExtend from "@/main/core/baseClass/StringExtend";
import Directory from "@/main/utils/Directory";
import Php from "@/main/core/php/Php";
 import Database from "@/main/core/Database";
import {isWindows } from '@/main/utils/utils'

export default class SoftwareInit extends StringExtend{
    static {
        super.init();
    }

    static async initAll() {
        await Promise.all([
            this.initNginx(),
            this.initAllPHP(),
            this.initAllMySQL()
        ]);
        await this.initMySQL();
    }

    static async initNginx() {
        try {
            let path = Path.Join(GetPath.getNginxConfDir(), 'nginx.conf');
            let text = File.ReadAllText(path);
            let pattern = /root\s+\S+\s*;/g;
            let wwwPath = Path.Join(GetPath.getNginxDir(), 'html').replaceSlash();
            let replaceStr = `root ${wwwPath};`;
            text = text.replaceAll(pattern, replaceStr);

            File.WriteAllText(path, text);

            await this.initNginxLocalhostConf();
            await this.initNginxPhpmyadminConf();
        } catch (error) {
            throw new Error(`初始化Nginx配置失败！${error.message}`);
        }
    }

    static async initNginxLocalhostConf() {
        let path = Path.Join(GetPath.getNginxVhostsDir(), 'localhost_80.conf');
        if (File.Exists(path)) {
            let text = File.ReadAllText(path);
            let pattern = /root\s+\S+\s*;/g;
            let rootPath = Path.Join(GetPath.getWebsiteDir(), 'localhost').replaceSlash();
            let replaceStr = `root ${rootPath};`;
            text = text.replaceAll(pattern, replaceStr);
            File.WriteAllText(path, text);
        }
    }

    static async initNginxPhpmyadminConf() {
        let path = Path.Join(GetPath.getNginxVhostsDir(), 'localhost_888.conf');
        if (File.Exists(path)) {
            let text = File.ReadAllText(path);
            let pattern = /root\s+\S+\s*;/g;
            let rootPath = Path.Join(GetPath.getToolTypeDir(), 'phpMyAdmin').replaceSlash();
            let replaceStr = `root ${rootPath};`;
            text = text.replaceAll(pattern, replaceStr);
            File.WriteAllText(path, text);
        }
    }

    static async initAllPHP() {
        let phpList = SoftwareExtend.getPHPList()

        for (const item of phpList) {
            await this.initPHP(item.version);
        }
    }

    static async initPHP(version) {
        await this.initPHPConf(version);
        if (!isWindows) {
            await this.createPHPFpmConf(version);
        }
    }

    static async createPHPFpmConf(version) {
        let phpDirPath = GetPath.getPhpDir(version);
        let confPath = Path.Join(phpDirPath, 'etc/php-fpm.conf')
        if (!File.Exists(confPath)) {
            File.WriteAllText(confPath, Php.getFpmConfText(version))
        }
    }

    static async initPHPConf(version) {
        try {
            let phpDirPath = GetPath.getPhpDir(version);
            let confDirPath = isWindows ? phpDirPath : Path.Join(phpDirPath, 'etc');
            let confPath = Path.Join(confDirPath, 'php.ini');

            if (!File.Exists(confPath)) {
                File.Copy(Path.Join(confDirPath, 'php.ini-development'), confPath);
            }

            let text = File.ReadAllText(confPath);

            text = text.replace(/(?<=\n);?.?max_execution_time\s*=.*/, 'max_execution_time = 300');
            text = text.replace(/(?<=\n);?.?memory_limit\s*=.*/, 'memory_limit = 512M');
            text = text.replace(/(?<=\n);?.?post_max_size\s*=.*/, 'post_max_size = 256M');
            text = text.replace(/(?<=\n);?.?upload_max_filesize\s*=.*/, 'upload_max_filesize = 200M');
            text = text.replace(/(?<=\n);?.?date.timezone\s*=.*/, 'date.timezone = Asia/Shanghai');

            if (isWindows) {
                text = text.replace(/(?<=\n);?.?cgi.fix_pathinfo\s*=.*/, 'cgi.fix_pathinfo=1');

                let i = 0;
                text = text.replace(/(?<=\n);?.?extension_dir\s*=.*/g, match => {
                    //仅替换第二个
                    return ++i === 2 ? 'extension_dir = "ext"' : match;
                });

                //需要php版本大于等于7.2
                let extensionArr = ['bz2', 'curl', 'fileinfo', 'gd', 'mbstring', 'exif', 'mysqli', 'odbc',
                    'openssl', 'pdo_mysql', 'pdo_odbc', 'soap', 'sockets', 'sodium', 'zip'];
                for (const extension of extensionArr) {
                    text = Php.getSwitchExtensionConfText(text, extension, true);
                }
            } else {
                //非Windows系统
                let extDir = Php.getExtensionDir(version)
                //仅替换第一个
                text = text.replace(/(?<=\n);?.?extension_dir\s*=.*/, `extension_dir = "${extDir}"`);
            }

            let phpTempPath = Path.Join(GetPath.geTempDir(), 'php');
            let uploadPattern = /(?<=\n);?.?upload_tmp_dir\s*=.*/g;
            let replaceUploadStr = `upload_tmp_dir = "${phpTempPath.replaceSlash()}"`;
            text = text.replaceAll(uploadPattern, replaceUploadStr);

            let sessionPattern = /(?<=\n);?.?session.save_path\s*=.*/g;
            let replaceSessionStr = `session.save_path = "${phpTempPath.replaceSlash()}"`;
            text = text.replaceAll(sessionPattern, replaceSessionStr);

            File.WriteAllText(confPath, text);
        } catch (error) {
            throw new Error(`初始化PHP配置失败！${error.message}`);
        }
    }

    static async initAllMySQL() {
        let mysqlList = SoftwareExtend.getMySQLList();

        for (const item of mysqlList) {
            await this.initMySQLConf(item.version);
        }
    }

    static async initMySQLConf(version) {
        try {
            let mysqlDir = GetPath.getMysqlDir(version);
            let confPath = isWindows ? Path.Join(mysqlDir, 'my.ini') : Path.Join(mysqlDir, 'my.cnf');
            let text = File.ReadAllText(confPath);
            let mysqlPath = GetPath.getMysqlDir(version);

            //(?<=\n)basedir\s*=\s*.+
            let basePattern = /(?<=\n)basedir\s*=\s*.+/g;
            let replaceBaseStr = `basedir = "${mysqlPath.replaceSlash()}"`;
            text = text.replaceAll(basePattern, replaceBaseStr);

            //(?<=\n)datadir\s*=\s*.+
            let dataPattern = /(?<=\n)datadir\s*=\s*.+/g;
            let dataPath = GetPath.getMysqlDataDir(version);
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

    /**
     * 初始化MySQL data目录和重置密码,todo:和initMySQLConf合一个方法
     * @returns {Promise<void>}
     */
    static async initMySQL() {
        let mysqlList = SoftwareExtend.getMySQLList();
        for (const item of mysqlList) {
            let version = item.version;
            if (!Directory.Exists(GetPath.getMysqlDataDir(version))) {
                //如果mysql data目录不存在，初始化生成data目录，并重置密码
                await Database.initMySQL(version);
            }
        }
    }

}
