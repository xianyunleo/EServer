import path from "path";
import App from "@/main/App";
import Software from "@/main/core/software/Software";
import OS from "@/main/core/OS";
import {TEMP_DIR_NAME} from "@/main/constant";

export default class GetPath {
    static getBinPath(){
        return path.join(App.getUserCorePath(), 'bin');
    }

    static geTempPath(){
        return path.join(App.getUserCorePath(), TEMP_DIR_NAME);
    }

    static getSoftwarePath(){
        return path.join(App.getUserCorePath(), 'software');
    }

    static getPhpTypePath(){
        return path.join(GetPath.getSoftwarePath(), 'php');
    }

    static getServerTypePath(){
        return path.join(GetPath.getSoftwarePath(), 'server');
    }

    static getToolTypePath(){
        return path.join(GetPath.getSoftwarePath(), 'tool');
    }

    static getNginxPath(){
        return path.join(GetPath.getServerTypePath(), 'nginx');
    }

    static getNginxConfPath(){
        return path.join(GetPath.getNginxPath(), 'conf');
    }

    static getNginxVhostsPath(){
        return path.join(GetPath.getNginxConfPath(), 'vhosts');
    }

    static getNginxRewritePath(){
        return path.join(GetPath.getNginxConfPath(), 'rewrite');
    }

    static getNginxVhostsRewritePath(){
        return path.join(GetPath.getNginxVhostsPath(), 'rewrite');
    }

    static getDatabasePath() {
        return path.join(App.getUserCorePath(), 'database');
    }

    static getPhpPath(version) {
        return path.join(GetPath.getPhpTypePath(), `php-${version}`);
    }

    static getPhpBinPath(version) {
        if(OS.isWindows()){
            return path.join(GetPath.getPhpPath(version), 'php.exe');
        }
        return path.join(GetPath.getPhpPath(version), 'bin/php');
    }

    static getComposerBinPath() {
        return path.join(GetPath.getToolTypePath(), 'Composer/composer.phar');
    }

    static getMysqlPath(version) {
        return path.join(GetPath.getServerTypePath(), `mysql-${version}`);
    }

    static getMysqlDataPath(version) {
        return path.join(GetPath.getDatabasePath(), `mysql-${version}-data`);
    }

    static getWebsitePath(){
        return path.join(App.getUserCorePath(), 'www');
    }


    static getMysqlIconPath() {
        return 'file://' + path.join(Software.getIconPath(), 'mysql.png')
    }

    static getHostsPath() {
        if (OS.isWindows()) {
            return 'C:\\Windows\\System32\\drivers\\etc\\hosts';
        } else {
            return '/etc/hosts';
        }
    }
}

