/* global __static */
import path from "path";
import {CORE_PATH_NAME,MAC_CORE_PATH_NAME} from "@/main/constant";
import is from "electron-is";

export function getAppPath(){
    return path.dirname(getExecutablePath());
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
        result = path.join(getAppPath(), `../${MAC_CORE_PATH_NAME}`)
        if (is.dev()) {
            result = path.join(getPlatformPath(), MAC_CORE_PATH_NAME)
        }
    }
    return result
}

export function getPlatformPath(){
    return path.join(__static, `../extra/${process.platform}`);
}


