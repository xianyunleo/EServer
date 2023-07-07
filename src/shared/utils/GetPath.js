import path from "path";
import App from "@/main/App";
import Software from "@/main/core/software/Software";
import OS from "@/main/core/OS";
import {TEMP_DIR_NAME} from "@/main/constant";

export default class GetPath {
    static getBinDir(){
        return path.join(App.getUserCoreDir(), 'bin');
    }

    static geTempDir(){
        return path.join(App.getUserCoreDir(), TEMP_DIR_NAME);
    }

    static getDownloadsDir() {
        return path.join(App.getUserCoreDir(), 'downloads');
    }

    static getSoftwareDir(){
        return path.join(App.getUserCoreDir(), 'software');
    }

    static getPhpTypeDir(){
        return path.join(this.getSoftwareDir(), 'php');
    }

    static getServerTypeDir(){
        return path.join(this.getSoftwareDir(), 'server');
    }

    static getToolTypeDir(){
        return path.join(this.getSoftwareDir(), 'tool');
    }

    static getNginxDir(){
        return path.join(this.getServerTypeDir(), 'nginx');
    }

    static getNginxConfDir(){
        return path.join(this.getNginxDir(), 'conf');
    }

    static getNginxVhostsDir(){
        return path.join(this.getNginxConfDir(), 'vhosts');
    }

    static getNginxRewriteDir(){
        return path.join(this.getNginxConfDir(), 'rewrite');
    }

    static getNginxVhostsRewriteDir(){
        return path.join(this.getNginxVhostsDir(), 'rewrite');
    }

    static getDatabaseDir() {
        return path.join(App.getUserCoreDir(), 'database');
    }

    static getPhpDir(version) {
        return path.join(this.getPhpTypeDir(), `php-${version}`);
    }

    static getPhpExePath(version) {
        if(OS.isWindows()){
            return path.join(this.getPhpDir(version), 'php.exe');
        }
        return path.join(this.getPhpDir(version), 'bin/php');
    }

    static getComposerExePath() {
        return path.join(this.getToolTypeDir(), 'Composer/composer.phar');
    }

    static getMysqlDir(version) {
        return path.join(this.getServerTypeDir(), `mysql-${version}`);
    }

    static getMysqlDataDir(version) {
        return path.join(this.getDatabaseDir(), `mysql-${version}-data`);
    }

    static getWebsiteDir(){
        return path.join(App.getUserCoreDir(), 'www');
    }

    static getScriptDir() {
        return path.join(App.getCoreDir(), 'script');
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

