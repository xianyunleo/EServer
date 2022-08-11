import path from "path";
import {getUserCorePath} from "@/main/app";
import is from "electron-is";

export function getSoftwarePath(){
    return path.join(getUserCorePath(), 'software');
}

export function getNginxPath(){
    return path.join(getSoftwarePath(), 'nginx');
}

export function getNginxVhostsPath(){
    return path.join(getNginxPath(), 'vhosts');
}

export function getPhpPath(){
    return path.join(getSoftwarePath(), 'php');
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