import path from "path";
import App from "@/main/App";
import Software from "@/main/software/Software";

export default class GetPath {
    static getSoftwarePath(){
        return path.join(App.getUserCorePath(), 'software');
    }

    static getServerPath(){
        return path.join(GetPath.getSoftwarePath(), 'server');
    }

    static getNginxPath(){
        return path.join(GetPath.getServerPath(), 'nginx');
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

    static getPHPPath(){
        return path.join(GetPath.getSoftwarePath(), 'php');
    }

    static getWWWPath(){
        return path.join(App.getUserCorePath(), 'www');
    }


    static getDownloadsPath(){
        let corePath = App.getUserCorePath();
        return path.join(corePath, 'downloads');
    }

    static getMysqlIconPath() {
        return 'file://' + path.join(Software.getIconPath(), 'mysql.png')
    }

}

