/* global __static */
import path from "path";
import {app} from '@electron/remote'
import {CORE_PATH_NAME,MAC_CORE_PATH_NAME} from "@/main/constant";
import is from "electron-is";


export function getAppPath(){
    if(is.windows()){
        return path.dirname(getExecutablePath());
    }else{
        //mac返回xxx.app/Contents/所在的路径
        return path.join(app.getAppPath(),'../../')
    }

}

export function getExecutablePath(){
    return process.execPath;
}

export function getCorePath() {
    let result = '';
    if (is.windows()) {
        result = path.join(getAppPath(), CORE_PATH_NAME)
        if (is.dev()) {
            result = path.join(getPlatformPath(), CORE_PATH_NAME)
        }
    } else if (is.macOS()) {
        result = path.join(getAppPath(), MAC_CORE_PATH_NAME)
        if (is.dev()) {
            result = path.join(getPlatformPath(), CORE_PATH_NAME)
        }
    }
    return result
}

export function getPlatformPath(){
    return path.join(__static, `../extra/${process.platform}`);
}


