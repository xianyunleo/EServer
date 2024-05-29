import { electronRequire } from '@/main/utils/electron'
import { isDev, isMacOS, isWindows } from '@/main/utils/utils'
import path from 'path'
import { MAC_USER_CORE_DIR, InitFiles_DIR_NAME, TEMP_DIR_NAME } from '@/main/utils/constant'
import DirUtil from '@/main/utils/DirUtil'
import FileUtil from '@/main/utils/FileUtil'
import Path from '@/main/utils/Path'
import Software from '@/main/core/software/Software'
import GetPath from '@/shared/utils/GetPath'
import LocalInstall from '@/main/core/software/LocalInstall'
import FsUtil from '@/main/utils/FsUtil'
import GetAppPath from '@/main/utils/GetAppPath'
import Shell from '@/main/utils/Shell'
import { extractZip } from '@/main/utils/extract'

const app = electronRequire('app')

export default class App {
    static getVersion() {
        return app.getVersion()
    }

    static async initFileExists() {
        return await FileUtil.Exists(GetAppPath.getInitFilePath())
    }

    static async init() {
        const initFile = GetAppPath.getInitFilePath()

        if (!await FileUtil.Exists(initFile)) {
            return
        }

        const softwareDirExists = await Software.DirExists()

        if (isMacOS && !isDev) {
            if (!await DirUtil.Exists(MAC_USER_CORE_DIR)) {
                await DirUtil.Create(MAC_USER_CORE_DIR)
            }
            await this.updateMacCoreSubDir(['Library'])
        }

        await this.moveInitFiles(['downloads', 'www', 'config'])
        await this.createCoreSubDir(['software', 'database', 'bin', `${TEMP_DIR_NAME}/php`])

        if (!softwareDirExists) { //目录不存在说明是第一次安装，不是覆盖安装
            const files = await DirUtil.GetFiles(GetPath.getDownloadsDir())
            await LocalInstall.installMultiple(files)
        }

        await FileUtil.Delete(initFile)
    }

    static async deleteInitFile() {
        const initFile = GetAppPath.getInitFilePath()
        if (await FileUtil.Exists(initFile)) {
            await FileUtil.Delete(initFile)
        }
    }

    static async checkInstall(){
        const appPath = GetAppPath.getDir()
        if (appPath.includes(' ')) {
            throw new Error('安装路径不能包含空格！')
        }

        if (/[\u4e00-\u9fa5]/.test(appPath)) {
            throw new Error('安装路径不能包含中文！')
        }

        if (isWindows) {
            const hmc = require('hmc-win32')
            const semverDiff = require('semver-diff')
            const vcVersion = hmc.getStringRegKey('HKEY_LOCAL_MACHINE', 'SOFTWARE\\Microsoft\\DevDiv\\VC\\Servicing\\14.0\\RuntimeMinimum', 'Version')
            const minVersion = '14.29.0' //Visual Studio 2019
            if (!vcVersion || !semverDiff(minVersion, vcVersion)) {
                throw new Error('需要安装最新的Visual C++ 2022 Runtime！\nhttps://aka.ms/vs/17/release/vc_redist.x64.exe')
            }
        }
    }

    //覆盖安装，执行update
    static async update() {
        if (isDev) {
            return
        }

        if (isMacOS) {
            await this.updateMacCoreSubDir(['Library'])
        }

        //下面update逻辑，用于更新 UserCoreDir
        const updateDir = Path.Join(GetAppPath.getCoreDir(), 'update')
        if (await DirUtil.Exists(updateDir)) {
            const updateJson = await FileUtil.ReadAll(Path.Join(updateDir, 'update.json'))
            const updateObj = JSON.parse(updateJson)
            const updateFile = Path.Join(updateDir, updateObj.archiveFile)
            if (await FileUtil.Exists(updateFile)) {
                extractZip(updateFile, Path.Join(GetAppPath.getUserCoreDir(), updateObj.targetDir))
            }
        }
    }

    /**
     *  Mac更新User Core目录下的文件
     * @param dirs
     */
    static async updateMacCoreSubDir(dirs) {
        let corePath = GetAppPath.getCoreDir()
        for (const dir of dirs) {
            let source = Path.Join(corePath, dir)
            if (!await DirUtil.Exists(source)) {
                continue
            }
            let target = Path.Join(MAC_USER_CORE_DIR, dir)
            if (!await DirUtil.Exists(target)) {
                await DirUtil.Create(target)
            }
            await Shell.exec(`rsync -a ${source}/* ${target}`)
            await DirUtil.Delete(source)
        }
    }

    /**
     * 创建目录，如果目录不存在的情况下
     * @param dirs
     */
    static async createCoreSubDir(dirs) {
        for (const dir of dirs) {
            let p = path.join(GetAppPath.getUserCoreDir(), dir)
            if (!await DirUtil.Exists(p)) {
                await DirUtil.Create(p)
            }
        }
    }

    /**
     * 将initFiles目录下的文件（文件夹）移动到用户操作的核心目录
     * @param files
     */
    static async moveInitFiles(files = []) {
        let initFilesPath = Path.Join(GetAppPath.getCoreDir(), InitFiles_DIR_NAME)
        for (const file of files) {
            const source = Path.Join(initFilesPath, file)
            const target = Path.Join(GetAppPath.getUserCoreDir(), file)

            if (await FsUtil.Exists(target)) {
                FsUtil.Remove(source, { force: true, recursive: true }) //不捕捉错误
            } else {
                await FsUtil.Rename(source, target)
            }
        }
    }

    static exit() {
        app.exit()
    }

}
