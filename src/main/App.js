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
import DirUtil from '@/main/utils/DirUtil'
import FileUtil from '@/main/utils/FileUtil'
import Path from '@/main/utils/Path'
import child_process from 'child_process'
import Software from "@/main/core/software/Software";
import GetPath from "@/shared/utils/GetPath";
import LocalInstall from "@/main/core/software/LocalInstall";
import FsUtil from '@/main/utils/FsUtil'

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

    static async initFileExists() {
        return await FileUtil.Exists(this.getInitFilePath());
    }

    static async init() {
        if (this.getDir().includes(' ')) {
            throw new Error('安装路径不能包含空格！');
        }

        let initFile = this.getInitFilePath();

        if (!await FileUtil.Exists(initFile)) {
            return;
        }

        const softwareDirExists = await Software.DirExists();

        if (isMacOS && !isDev) {
            if (!await DirUtil.Exists(MAC_USER_CORE_DIR)) {
                await DirUtil.Create(MAC_USER_CORE_DIR);
            }
            await this.updateMacCoreSubDir(['Library']);
        }

        await this.moveInitFiles(["downloads", "www"]);
        await this.createCoreSubDir(["software", "database", "bin",`${TEMP_DIR_NAME}/php`]);

        if (!softwareDirExists) { //目录不存在说明是第一次安装，不是覆盖安装
            const files = await DirUtil.GetFiles(GetPath.getDownloadsDir());
            await LocalInstall.installMultiple(files)
        }

        await FileUtil.Delete(initFile);
    }

    static async deleteInitFile() {
        let initFile = this.getInitFilePath();
        if (await FileUtil.Exists(initFile)) {
            await FileUtil.Delete(initFile);
        }
    }

    //覆盖安装，执行update
    static async update() {
        if (isMacOS && !isDev) {
            await this.updateMacCoreSubDir(['Library'])
        }
    }

    /**
     *  Mac更新User Core目录下的文件
     * @param dirs
     */
    static async updateMacCoreSubDir(dirs) {
        let corePath = this.getCoreDir();
        for (const dir of dirs) {
            let source = Path.Join(corePath, dir);
            if (!await DirUtil.Exists(source)) {
                continue;
            }
            let target = Path.Join(MAC_USER_CORE_DIR, dir);
            if (!await DirUtil.Exists(target)) {
                await DirUtil.Create(target);
            }
            child_process.execSync(`rsync -a ${source}/* ${target}`);
            await DirUtil.Delete(source);
        }
    }

    /**
     * 创建目录，如果目录不存在的情况下
     * @param dirs
     */
    static async createCoreSubDir(dirs) {
        for (const dir of dirs) {
            let p = path.join(this.getUserCoreDir(), dir);
            if (!await DirUtil.Exists(p)) {
                await DirUtil.Create(p);
            }
        }
    }

    /**
     * 将initFiles目录下的文件（文件夹）移动到用户操作的核心目录
     * @param files
     */
    static async moveInitFiles(files = []) {
        let initFilesPath = Path.Join(this.getCoreDir(), InitFiles_DIR_NAME);
        for (const file of files) {
            const source = Path.Join(initFilesPath, file);
            const target = Path.Join(this.getUserCoreDir(), file);

            if (await FsUtil.Exists(target)) {
                FsUtil.Remove(source, { force: true, recursive: true }) //不捕捉错误
            } else {
                await FsUtil.Rename(source, target)
            }
        }
    }

    static exit() {
        app.exit();
    }

}
