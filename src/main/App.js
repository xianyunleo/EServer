import {electronRequire} from '@/main/utils/electron';
import { isDev, isMacOS, isWindows } from '@/main/utils/utils'
import path from 'path'
import {
    WIN_CORE_PATH_NAME,
    MAC_CORE_PATH_NAME,
    MAC_USER_CORE_DIR,
    INIT_FILE_NAME,
    InitFiles_DIR_NAME,
    TEMP_DIR_NAME
} from '@/main/utils/constant'
import Directory from '@/main/utils/Directory'
import File from '@/main/utils/File'
import Path from '@/main/utils/Path'
import child_process from 'child_process'
import fs from 'fs'
import Software from "@/main/core/software/Software";
import GetPath from "@/shared/utils/GetPath";
import LocalInstall from "@/main/core/software/LocalInstall";

const app = electronRequire('app');

export default class App {
    static getDir() {
        if (isDev) {
            return app.getAppPath();
        } else {
            return Path.GetDirectoryName(this.getExePath());
        }
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
    static getContentsDir() {
        if (isMacOS) {
            return Path.Join(this.getDir(), '..');
        }
        return '';
    }

    /**
     * 当系统是macOS时，返回APP的icon.icns绝对路径
     * @returns {string}
     */
    static getIcnsPath() {
        if (isMacOS) {
            if (isDev) {
                return Path.Join(this.getDir(), `build/icons/icon.icns`);
            } else {
                return Path.Join(this.getContentsDir(), 'Resources/icon.icns');
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
    static getCoreDir(){
        let result = '';
        if (isWindows) {
            if (isDev) {
                result = path.join(this.getPlatformDir(), WIN_CORE_PATH_NAME)
            } else {
                result = path.join(this.getDir(), WIN_CORE_PATH_NAME)
            }
        } else if (isMacOS) {
            if (isDev) {
                result = path.join(this.getPlatformDir(), MAC_CORE_PATH_NAME)
            } else {
                result = path.join(this.getContentsDir(), MAC_CORE_PATH_NAME);
            }
        }
        return result
    }

    /**
     * 获取便于用户操作的核心目录
     * @returns {string}
     */
    static getUserCoreDir() {
        if (isMacOS && !isDev) {
            return MAC_USER_CORE_DIR;
        }
        return this.getCoreDir();
    }

    static getSettingsDir(){
        return this.getUserCoreDir();
    }

    static getInitFilePath() {
        return path.join(this.getCoreDir(), INIT_FILE_NAME);
    }

    static getPlatformDir() {
        return path.join(this.getDir(), `extra/${process.platform}`);
    }

    static initFileExists() {
        return File.Exists(this.getInitFilePath());
    }

    static async init() {
        if (this.getDir().includes(' ')) {
            throw new Error('安装路径不能包含空格！');
        }

        let initFile = this.getInitFilePath();

        if (!File.Exists(initFile)) {
            return;
        }

        const softwareDirExists = Software.DirExists();

        if (isMacOS && !isDev) {
            if (!Directory.Exists(MAC_USER_CORE_DIR)) {
                Directory.CreateDirectory(MAC_USER_CORE_DIR);
            }
            this.updateMacCoreSubDir(['Library']);
        }

        this.moveInitFiles(["downloads", "www"]);
        this.createCoreSubDir(["software", "database", "bin",`${TEMP_DIR_NAME}/php`]);

        if (!softwareDirExists) { //目录不存在说明是第一次安装，不是覆盖安装
            const files = Directory.GetFiles(GetPath.getDownloadsDir(), '.7z');
            await LocalInstall.installMultiple(files)
        }

        File.Delete(initFile);
    }

    static deleteInitFile(){
        let initFile = this.getInitFilePath();
        if (File.Exists(initFile)) {
            File.Delete(initFile);
        }
    }

    static async update() {
        if (isMacOS && !isDev) {
            //todo
        }
    }

    /**
     * 将App包内的Core子目录移动到用户Core目录，如果目录不存在的情况下
     * @param dirs
     */
    static moveMacCoreSubDir(dirs) {
        let corePath = this.getCoreDir();
        for (const dir of dirs) {
            let source = Path.Join(corePath, dir);
            if (!Directory.Exists(source)) {
                continue;
            }
            let target = Path.Join(MAC_USER_CORE_DIR, dir);
            if (!Directory.Exists(target)) {
                Directory.Move(source, target);
            }
        }
    }

    /**
     *  覆盖合并目录内容，如果目录不存在，则创建
      * @param dirs
     */
    static updateMacCoreSubDir(dirs) {
        let corePath = this.getCoreDir();
        for (const dir of dirs) {
            let source = Path.Join(corePath, dir);
            if (!Directory.Exists(source)) {
                continue;
            }
            let target = Path.Join(MAC_USER_CORE_DIR, dir);
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
            let p = path.join(this.getUserCoreDir(), dir);
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
        let initFilesPath = Path.Join(this.getCoreDir(),InitFiles_DIR_NAME);
        for (const file of files) {
            let source = Path.Join(initFilesPath, file);
            if(!fs.existsSync(source)){
                continue;
            }
            let target = Path.Join(this.getUserCoreDir(), file);
            if (!fs.existsSync(target)) {
                fs.renameSync(source, target);
            } else {
                let options = {force: true, recursive: true};
                fs.rm(source, options, err => {
                    console.log(`Error moveInitFiles fs.rm ${source}\r${err}`);
                });
            }
        }
    }
    static exit() {
        app.exit();
    }

}
