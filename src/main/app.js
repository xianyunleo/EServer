/* global __static */
import path from "path";
import {app} from '@electron/remote'
import {WIN_CORE_PATH_NAME, INIT_FILE_NAME, MAC_CORE_PATH_NAME, MAC_USER_CORE_PATH} from "@/main/constant";
import is from "electron-is";
import {fileExists, linuxFileMove} from "@/main/utils";
import fs from "fs";


export function getAppPath() {
    if (is.windows()) {
        return path.dirname(getExecutablePath());
    } else {
        //mac返回xxx.app/Contents/所在的路径
        return path.join(app.getAppPath(), '../../')
    }

}

export function getExecutablePath() {
    return process.execPath;
}

export function getUserCorePath() {
    let result = '';
    if (is.windows()) {
        if (is.dev()) {
            result = path.join(getPlatformPath(), WIN_CORE_PATH_NAME)
        } else {
            result = path.join(getAppPath(), WIN_CORE_PATH_NAME)
        }
    } else if (is.macOS()) {
        if (is.dev()) {
            result = path.join(getPlatformPath(), MAC_CORE_PATH_NAME)
        } else {
            result = path.join(getAppPath(), MAC_CORE_PATH_NAME)
        }
    }
    return result
}

export function getInitFilePath() {
    return path.join(getUserCorePath(), INIT_FILE_NAME);
}

export function getPlatformPath() {
    return path.join(__static, `../extra/${process.platform}`);
}

export async function initFileExists() {
    let initFile = getInitFilePath();
    return await fileExists(initFile);
}

export async function init() {
    let initFile = getInitFilePath();
    if (!await fileExists(initFile)) {
        return;
    }
    if (is.macOS() && is.production()) {
        if (!await fileExists(MAC_USER_CORE_PATH)) {
            await fs.promises.mkdir(MAC_USER_CORE_PATH);
            await moveCoreSubDir(['software', 'tmp', 'www']);
            await createCoreSubDir(['downloads']);
        }
    }
    await fs.promises.unlink(initFile);
}

/**
 * 将App包内的Core子目录移动到用户Core目录
 * @param dirs
 * @returns {Promise<void>}
 */
export async function moveCoreSubDir(dirs) {
    let corePath = getUserCorePath();
    for (const dir of dirs) {
        await linuxFileMove(path.join(corePath, dir), path.join(MAC_USER_CORE_PATH, dir));
    }
}

export async function createCoreSubDir(dirs) {
    for (const dir of dirs) {
        await fs.promises.mkdir(path.join(MAC_USER_CORE_PATH, dir));
    }
}

