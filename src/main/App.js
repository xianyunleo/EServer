/* global __static */
import path from "path";
import {app} from '@electron/remote'
import {WIN_CORE_PATH_NAME, INIT_FILE_NAME, MAC_CORE_PATH_NAME, MAC_USER_CORE_PATH} from "@/main/constant";
import Database from "@/main/core/Database";
import SoftwareExtend from "@/main/core/software/SoftwareExtend";
import Directory from "@/main/utils/Directory";
import File from "@/main/utils/File";
import Path from "@/main/utils/Path";
import child_process from "child_process";
import GetPath from "@/shared/utils/GetPath";
import OS from "@/main/core/OS";
import Settings from "@/main/Settings";
import SoftwareInit from "@/main/core/software/SoftwareInit";


export default class App {
    static isDev() {
        return !app.isPackaged;
    }

    static getPath() {
        return Path.GetDirectoryName(this.getExePath());
    }

    /**
     * 返回可执行文件路径，Mac返回路径为 AppName.app/Contents/MacOS/AppName
     * @returns {string}
     */
    static getExePath() {
        return app.getPath('exe');
    }

    /**
     * 当系统是macOS时，返回App的Contents目录的路径
     * @returns {string}
     */
    static getContentsPath() {
        if (OS.isMacOS()) {
            return Path.Join(this.getPath(), '..');
        }
        return '';
    }

    /**
     * 当系统是macOS时，返回APP的icon.icns绝对路径
     * @returns {string}
     */
    static getIcnsPath() {
        if (OS.isMacOS()) {
            if (App.isDev()) {
                return Path.Join(__static, `../build/icons/icon.icns`);
            } else {
                return Path.Join(App.getContentsPath(), 'Resources/icon.icns');
            }
        }
        return '';
    }

    static getVersion(){
        return app.getVersion();
    }

    /**
     * 获取App核心目录
     * @returns {string}
     */
    static getCorePath(){
        let result = '';
        if (OS.isWindows()) {
            if (App.isDev()) {
                result = path.join(App.getPlatformPath(), WIN_CORE_PATH_NAME)
            } else {
                result = path.join(App.getPath(), WIN_CORE_PATH_NAME)
            }
        } else if (OS.isMacOS()) {
            if (App.isDev()) {
                result = path.join(App.getPlatformPath(), MAC_CORE_PATH_NAME)
            } else {
                result = path.join(App.getContentsPath(), MAC_CORE_PATH_NAME);
            }
        }
        return result
    }

    /**
     * 获取便于用户操作的核心目录
     * @returns {string}
     */
    static getUserCorePath() {
        if (OS.isMacOS() && !App.isDev()) {
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
        return File.Exists(App.getInitFilePath());
    }

    static async init() {
        if (this.getPath().includes(' ')) {
            throw new Error('安装路径不能包含空格！');
        }

        let initFile = App.getInitFilePath();

        if (!File.Exists(initFile)) {
            return;
        }
        if (OS.isMacOS() && !App.isDev()) {
            if (!Directory.Exists(MAC_USER_CORE_PATH)) {
                Directory.CreateDirectory(MAC_USER_CORE_PATH);
            }
            App.moveCoreSubDir(['tmp', 'www', 'software']);
            App.updateCoreSubDir(['Library']);
        }
        App.createCoreSubDir(['downloads', 'database', 'bin']);

        await SoftwareInit.initAll();
        await App.initMySQL();
        Settings.init();
        File.Delete(initFile);
    }

    /**
     * 初始化MySQL data目录和重置密码
     * @returns {Promise<void>}
     */
    static async initMySQL() {
        let mysqlList = SoftwareExtend.getMySQLList();
        for (const item of mysqlList) {
            let version = item.version;
            if (!Directory.Exists(GetPath.getMysqlDataPath(version))) {
                //如果mysql data目录不存在，初始化生成data目录，并重置密码
                await Database.initMySQL(version);
            }
        }
    }

    /**
     * 将App包内的Core子目录移动到用户Core目录，如果目录不存在的情况下
     * @param dirs
     */
    static moveCoreSubDir(dirs) {
        let corePath = App.getCorePath();
        for (const dir of dirs) {
            let source = Path.Join(corePath, dir);
            let target = Path.Join(MAC_USER_CORE_PATH, dir);
            if (!Directory.Exists(target)) {
                Directory.Move(source, target);
            }
        }
    }

    /**
     *  覆盖合并目录内容，如果目录不存在，则创建
      * @param dirs
     */
    static updateCoreSubDir(dirs) {
        let corePath = App.getCorePath();
        for (const dir of dirs) {
            let source = Path.Join(corePath, dir);
            let target = Path.Join(MAC_USER_CORE_PATH, dir);
            if (!Directory.Exists(target)) {
                Directory.CreateDirectory(target);
            }
            child_process.execSync(`rsync -a ${source}/* ${target}`);
            Directory.Delete(source, true);
        }
    }

    /**
     * 创建目录，如果目录不存在的情况下
     * @param dirs
     */
    static createCoreSubDir(dirs) {
        for (const dir of dirs) {
            let p = path.join(this.getUserCorePath(), dir);
            if (!Directory.Exists(p)) {
                Directory.CreateDirectory(p);
            }
        }
    }

    static exit() {
        app.exit();
    }


}




