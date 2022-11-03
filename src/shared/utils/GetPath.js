import path from "path";
import App from "@/main/App";
import Software from "@/main/core/software/Software";
import OS from "@/main/core/OS";

export default class GetPath {
    static getSoftwarePath(){
        return path.join(App.getUserCorePath(), 'software');
    }

    static getPHPTypePath(){
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

    static getMysqlPath(version) {
        return path.join(GetPath.getServerTypePath(), `mysql-${version}`);
    }

    static getMysqlDataPath(version) {
        return path.join(GetPath.getDatabasePath(), `mysql-${version}-data`);
    }

    static getWWWPath(){
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

