import path from "path";
import {getCorePath} from "@/main/app";
import is from "electron-is";

export function getPhpPath(){
    return path.join(getCorePath(), `bin/php`);
}

export function getHostsPath() {
    if (is.windows()) {
        return 'C:\\Windows\\System32\\drivers\\etc\\hosts';
    } else {
        return '/etc/hosts';
    }
}


export function getDownloadsPath(){
    let corePath = getCorePath();
    return path.join(corePath, 'downloads');
}