/* global __static */
import path from "path";
import {app} from '@electron/remote'
import {WIN_CORE_PATH_NAME, INIT_FILE_NAME, MAC_CORE_PATH_NAME, MAC_USER_CORE_PATH} from "@/main/constant";
import is from "electron-is";
import {fsDelete, fsExists, fsMove} from "@/main/utils/utils";
import fs from "fs";
import Database from "@/main/core/Database";
import ProcessExtend from "@/main/core/ProcessExtend";
import SoftwareExtend from "@/main/core/software/SoftwareExtend";
import Settings from "@/main/Settings";


export default class App {
    static isDev() {
        return !app.isPackaged;
    }

    static getAppPath() {
        if (is.windows()) {
            return path.dirname(App.getExecutablePath());
        } else {
            //mac app.getAppPath()返回xxx.app/Contents/所在的路径
            return path.join(app.getAppPath(), '../../')
        }
    }

    static getVersion(){
        return app.getVersion();
    }

    static getExecutablePath() {
        return process.execPath;
    }

    /**
     * 获取App核心目录
     * @returns {string}
     */
    static getCorePath(){
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
                result = path.join(App.getAppPath(), MAC_CORE_PATH_NAME);
            }
        }
        return result
    }

    /**
     * 获取用户操作目录，主要用在MacOS上
     * @returns {string}
     */
    static getUserCorePath() {
        if (is.macOS() && !App.isDev()) {
            return MAC_USER_CORE_PATH;
        }
        return App.getCorePath();
    }

    static getSettingsPath(){
        return App.getUserCorePath();
    }

    static getInitFilePath() {
        return path.join(App.getCorePath(), INIT_FILE_NAME);
    }

    static getPlatformPath() {
        return path.join(__static, `../extra/${process.platform}`);
    }

    static initFileExists() {
        return fsExists(App.getInitFilePath());
    }

    static async init() {
        let initFile = App.getInitFilePath();
        Settings.getInstance();
        if (!fsExists(initFile)) {
            return;
        }
        if (is.macOS() && !App.isDev()) {
            if (!fsExists(MAC_USER_CORE_PATH)) {
                fs.mkdirSync(MAC_USER_CORE_PATH);
                App.moveCoreSubDir(['software', 'tmp', 'www','Library']);
                App.createCoreSubDir(['downloads','database']);
            }
        }
        await App.initMySQL();
        fsDelete(initFile);
    }

    /**
     * 初始化MySQL data目录和重置密码
     * @returns {Promise<void>}
     */
    static async initMySQL() {
        let mysqlList = SoftwareExtend.getMySQLList();
        for (const item of mysqlList) {
            let version = item.version
            await Database.initMySQLData(version);
            await ProcessExtend.killByName('mysqld');
            await Database.resetMySQLPassword(version);
        }
    }

    /**
     * 将App包内的Core子目录移动到用户Core目录
     * @param dirs
     */
    static moveCoreSubDir(dirs) {
        let corePath = App.getCorePath();
        for (const dir of dirs) {
            fsMove(path.join(corePath, dir), path.join(MAC_USER_CORE_PATH, dir));
        }
    }

    static createCoreSubDir(dirs) {
        for (const dir of dirs) {
            let p = path.join(MAC_USER_CORE_PATH, dir);
            if (!fsExists(p)) {
                fs.mkdirSync(p);
            }
        }
    }
}




