/* global __static */
import path from "path";
import {app} from '@electron/remote'
import {CORE_PATH_NAME, INIT_FILE_NAME, MAC_CORE_PATH_NAME, MAC_USER_CORE_PATH} from "@/main/constant";
import is from "electron-is";
import {fileExists, linuxFileCopy} from "@/main/utils";
import fs from "fs";


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

export function getInitFilePath(){
    return  path.join(getCorePath(), INIT_FILE_NAME);
}

export function getPlatformPath(){
    return path.join(__static, `../extra/${process.platform}`);
}

export async function initFileExists(){
    let initFile = getInitFilePath();
    return await fileExists(initFile);
}

export async function init() {
    let initFile = getInitFilePath();
    if (!await fileExists(initFile)) {
        return;
    }
    if(is.macOS()){
        let corePath = getCorePath();
        let userCorePath = MAC_USER_CORE_PATH;
        if(!await fileExists(userCorePath)){
            await fs.promises.mkdir(userCorePath);
        }
        await linuxFileCopy(path.join(corePath,'downloads'),path.join(userCorePath,'downloads'));
        await linuxFileCopy(path.join(corePath,'software'),path.join(userCorePath,'software'));
    }
    await fs.promises.unlink(initFile);
}


