/* global __static */
import path from "path";
import {app} from '@electron/remote'
import {WIN_CORE_PATH_NAME, INIT_FILE_NAME, MAC_CORE_PATH_NAME, MAC_USER_CORE_PATH} from "@/main/constant";
import is from "electron-is";
import {fsDelete, fsExists, fsMove, getDirsByDir} from "@/main/utils";
import fs from "fs";
import GetPath from "@/main/GetPath";


export default class App {
    static isDev() {
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

    static initFileExists() {
        let initFile = App.getInitFilePath();
        return fsExists(initFile);
    }

    static init() {
        let initFile = App.getInitFilePath();
        if (!fsExists(initFile)) {
            return;
        }
        if (is.macOS() && !App.isDev()) {
            if (!fsExists(MAC_USER_CORE_PATH)) {
                fs.mkdirSync(MAC_USER_CORE_PATH);
                App.moveCoreSubDir(['software', 'tmp', 'www']);
                App.createCoreSubDir(['downloads']);
            }
        }
        fsDelete(initFile);
    }

    static initMySQL() {
        let serverPath = GetPath.getServerTypePath();
        let mysqlList = getDirsByDir(serverPath, 'mysql');
        for (const name of mysqlList) {
            let mysqlPath = path.join(serverPath, name);
            if (!fsExists()) {
                console.log(mysqlPath)
            }
        }
    }

    /**
     * 将App包内的Core子目录移动到用户Core目录
     * @param dirs
     */
    static moveCoreSubDir(dirs) {
        let corePath = App.getUserCorePath();
        for (const dir of dirs) {
            fsMove(path.join(corePath, dir), path.join(MAC_USER_CORE_PATH, dir));
        }
    }

    static createCoreSubDir(dirs) {
        for (const dir of dirs) {
            fs.mkdirSync(path.join(MAC_USER_CORE_PATH, dir));
        }
    }
}




