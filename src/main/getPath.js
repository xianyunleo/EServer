import path from "path";
import {getUserCorePath} from "@/main/app";
import is from "electron-is";

export function getSoftwarePath(){
    return path.join(getUserCorePath(), 'software');
}

export function getServerPath(){
    return path.join(getSoftwarePath(), 'server');
}

export function getNginxPath(){
    return path.join(getServerPath(), 'nginx');
}

export function getNginxConfPath(){
    return path.join(getNginxPath(), 'conf');
}

export function getNginxVhostsPath(){
    return path.join(getNginxConfPath(), 'vhosts');
}

export function getNginxRewritePath(){
    return path.join(getNginxConfPath(), 'rewrite');
}

export function getNginxVhostsRewritePath(){
    return path.join(getNginxVhostsPath(), 'rewrite');
}

export function getPHPPath(){
    return path.join(getSoftwarePath(), 'php');
}

export function getWWWPath(){
    return path.join(getUserCorePath(), 'www');
}

export function getHostsPath() {
    if (is.windows()) {
        return 'C:\\Windows\\System32\\drivers\\etc\\hosts';
    } else {
        return '/etc/hosts';
    }
}

export function getDownloadsPath(){
    let corePath = getUserCorePath();
    return path.join(corePath, 'downloads');
}