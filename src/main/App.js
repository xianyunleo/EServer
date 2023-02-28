/* global __static */
import path from "path";
import {app} from '@electron/remote'
import {
    WIN_CORE_PATH_NAME,
    MAC_CORE_PATH_NAME,
    MAC_USER_CORE_PATH,
    INIT_FILE_NAME,
    InitFiles_DIR_NAME
} from "@/main/constant";
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
import fs from "fs";


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
            if (this.isDev()) {
                return Path.Join(__static, `../build/icons/icon.icns`);
            } else {
                return Path.Join(this.getContentsPath(), 'Resources/icon.icns');
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
            if (this.isDev()) {
                result = path.join(this.getPlatformPath(), WIN_CORE_PATH_NAME)
            } else {
                result = path.join(this.getPath(), WIN_CORE_PATH_NAME)
            }
        } else if (OS.isMacOS()) {
            if (this.isDev()) {
                result = path.join(this.getPlatformPath(), MAC_CORE_PATH_NAME)
            } else {
                result = path.join(this.getContentsPath(), MAC_CORE_PATH_NAME);
            }
        }
        return result
    }

    /**
     * 获取便于用户操作的核心目录
     * @returns {string}
     */
    static getUserCorePath() {
        if (OS.isMacOS() && !this.isDev()) {
            return MAC_USER_CORE_PATH;
        }
        return this.getCorePath();
    }

    static getSettingsPath(){
        return this.getUserCorePath();
    }

    static getInitFilePath() {
        return path.join(this.getCorePath(), INIT_FILE_NAME);
    }

    static getPlatformPath() {
        return path.join(__static, `../extra/${process.platform}`);
    }

    static initFileExists() {
        return File.Exists(this.getInitFilePath());
    }

    static async init() {
        if (this.getPath().includes(' ')) {
            throw new Error('安装路径不能包含空格！');
        }

        let initFile = this.getInitFilePath();

        if (!File.Exists(initFile)) {
            return;
        }

        Settings.init();

        let softwareDirExists = Directory.Exists(GetPath.getSoftwarePath());

        if (OS.isMacOS() && !this.isDev()) {
            if (!Directory.Exists(MAC_USER_CORE_PATH)) {
                Directory.CreateDirectory(MAC_USER_CORE_PATH);
            }
            this.updateCoreSubDir(['Library']);
        }
        this.moveInitFiles(['tmp', 'www', 'software']);
        this.createCoreSubDir(['downloads', 'database', 'bin']);

        if (!softwareDirExists) { //softwareDirExists是false说明是第一次安装，不是覆盖安装
            await SoftwareInit.initAll();
        }

        await this.initMySQL();

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
        let corePath = this.getCorePath();
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
        let corePath = this.getCorePath();
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

    /**
     * 将initFiles目录下的文件（文件夹）移动到用户操作的核心目录
     * @param files
     */
    static moveInitFiles(files = []) {
        let initFilesPath = Path.Join(this.getCorePath(),InitFiles_DIR_NAME);
        for (const file of files) {
            let source = Path.Join(initFilesPath, file);
            let target = Path.Join(this.getUserCorePath(), file);
            if (!fs.existsSync(target)) {
                fs.renameSync(source, target);
            }
        }
    }

    static exit() {
        app.exit();
    }


}




