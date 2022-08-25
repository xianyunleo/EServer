/* global __static */
import path from "path";
import {app} from '@electron/remote'
import {WIN_CORE_PATH_NAME, INIT_FILE_NAME, MAC_CORE_PATH_NAME, MAC_USER_CORE_PATH} from "@/main/constant";
import is from "electron-is";
import {fsDelete, fsExists, fsMove} from "@/main/utils";
import fs from "fs";


export default class App{
    static isDev(){
        return !app.isPackaged;
    }

    static getAppPath() {
        if (is.windows()) {
            return path.dirname(App.getExecutablePath());
        } else {
            //mac返回xxx.app/Contents/所在的路径
            return path.join(app.getAppPath(), '../../')
        }
    }

    static getExecutablePath() {
        return process.execPath;
    }

    static getUserCorePath() {
        let result = '';
        if (is.windows()) {
            if (App.isDev()) {
                result = path.join(App.getPlatformPath(), WIN_CORE_PATH_NAME)
            } else {
                result = path.join(App.getAppPath(), WIN_CORE_PATH_NAME)
            }
        } else if (is.macOS()) {
            if (App.isDev()) {
                result = path.join(App.getPlatformPath(), MAC_CORE_PATH_NAME)
            } else {
                result = path.join(App.getAppPath(), MAC_CORE_PATH_NAME)
            }
        }
        return result
    }

    static getInitFilePath() {
        return path.join(App.getUserCorePath(), INIT_FILE_NAME);
    }

    static getPlatformPath() {
        return path.join(__static, `../extra/${process.platform}`);
    }

    static async initFileExists() {
        let initFile = App.getInitFilePath();
        return await fsExists(initFile);
    }

    static async init() {
        let initFile = App.getInitFilePath();
        if (!await fsExists(initFile)) {
            return;
        }
        if (is.macOS() && !App.isDev()) {
            if (!await fsExists(MAC_USER_CORE_PATH)) {
                await fs.promises.mkdir(MAC_USER_CORE_PATH);
                await App.moveCoreSubDir(['software', 'tmp', 'www']);
                await App.createCoreSubDir(['downloads']);
            }
        }
        await fsDelete(initFile);
    }

    /**
     * 将App包内的Core子目录移动到用户Core目录
     * @param dirs
     * @returns {Promise<void>}
     */
    static async moveCoreSubDir(dirs) {
        let corePath = App.getUserCorePath();
        for (const dir of dirs) {
            await fsMove(path.join(corePath, dir), path.join(MAC_USER_CORE_PATH, dir));
        }
    }

    static async createCoreSubDir(dirs) {
        for (const dir of dirs) {
            await fs.promises.mkdir(path.join(MAC_USER_CORE_PATH, dir));
        }
    }
}




