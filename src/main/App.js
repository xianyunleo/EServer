import { isDev, isMacOS, isWindows } from '@/main/utils/utils'
import path from 'path'
import { MAC_DATA_DIR, InitFiles_DIR_NAME, TEMP_DIR_NAME } from '@/main/utils/constant'
import GetPath from '@/shared/utils/GetPath'
import GetCorePath from '@/shared/utils/GetCorePath'
import GetDataPath from '@/shared/utils/GetDataPath'
import DirUtil from '@/main/utils/DirUtil'
import FileUtil from '@/main/utils/FileUtil'
import ChildApp from '@/main/services/childApp/ChildApp'
import LocalInstall from '@/main/services/childApp/LocalInstall'
import FsUtil from '@/main/utils/FsUtil'
import Shell from '@/main/utils/Shell'
import { extractZip } from '@/main/utils/extract'
import CommonInstall from '@/main/services/childApp/CommonInstall'
import Php from '@/main/services/php/Php'
import Env from '@/main/services/Env/Env'
import Settings from '@/main/Settings'

export default class App {
    static async initFileExists() {
        return await FileUtil.Exists(GetCorePath.getInitFilePath())
    }

    static async init() {
        const initFile = GetCorePath.getInitFilePath()

        if (!await FileUtil.Exists(initFile)) {
            return
        }
        //SoftwareDir为老的结构
        const childAppDirExists = await ChildApp.DirExists() ||  await DirUtil.Exists(GetDataPath.getSoftwareDir())

        if (isMacOS && !isDev) {
            if (!await DirUtil.Exists(MAC_DATA_DIR)) {
                await DirUtil.Create(MAC_DATA_DIR)
            }
            await this.updateMacDataSubDir(['Library'])
        }

        await this.moveInitFiles(['downloads', 'www', 'custom'])
        await this.createUserSubDir(['etc', 'childApp', 'database', 'bin', `${TEMP_DIR_NAME}/php`])

        if (!childAppDirExists) { //目录不存在说明是第一次安装，不是覆盖安装
            const files = await DirUtil.GetFiles(GetDataPath.getDownloadsDir())
            await LocalInstall.installMultiple(files)
        }

        await FileUtil.Delete(initFile)
    }

    static async deleteInitFile() {
        const initFile = GetCorePath.getInitFilePath()
        if (await FileUtil.Exists(initFile)) {
            await FileUtil.Delete(initFile)
        }
    }

    static async checkInstall(){
        const appPath = GetPath.getDir()
        if (appPath.includes(' ')) {
            throw new Error('安装路径不能包含空格！')
        }

        if (/[\u2E80-\u9FFF]/.test(appPath)) {
            throw new Error('安装路径不能包含中文等汉字！')
        }

        if (isWindows && process.arch === 'x64') { //hmc.getStringRegKey可能在arm64的Windows上有问题
            const hmc = require('hmc-win32')
            const semverDiff = require('semver-diff')
            const vcVersion = hmc.getStringRegKey('HKEY_LOCAL_MACHINE', `SOFTWARE\\Microsoft\\DevDiv\\VC\\Servicing\\14.0\\RuntimeMinimum`, 'Version')
            const minVersion = '14.44.0' //Visual Studio 2015-2022
            if (!vcVersion || !semverDiff(minVersion, vcVersion)) {
                throw new Error('需要安装最新的Visual C++ 2022+ Runtime！\nhttps://aka.ms/vs/17/release/vc_redist.x64.exe')
            }
        }
    }

    /**
     * 覆盖安装，执行update，返回 needRestart
     * @returns {Promise<boolean>}
     */
    static async update() {
        if (isDev) {
            return
        }
        let needRestart = false
        if (isMacOS) {
            await this.updateMacDataSubDir(['Library'])
        }
        await this.moveInitFiles(['downloads', 'www', 'custom', 'custom/childApp'])

        //目录childApp改名为childApp
        if (!await ChildApp.DirExists()) {
            needRestart = true
            await FsUtil.Copy(GetDataPath.getSoftwareDir(), GetDataPath.getChildAppDir(), { recursive: true })
        }

        //迁移配置文件到etc目录，并初始化
        const list = await ChildApp.getList()
        for (const item of list) {
            if (await DirUtil.Exists(ChildApp.getDir(item))) {
                await CommonInstall.configure(item)
            }
        }
        //update包更新逻辑
        const updateDir = path.join(GetCorePath.getDir(), 'update')
        if (await DirUtil.Exists(updateDir)) {
            const updateJson = await FileUtil.ReadAll(path.join(updateDir, 'update.json'))
            const updateObj = JSON.parse(updateJson)
            const updateFile = path.join(updateDir, updateObj.archiveFile)
            if (await FileUtil.Exists(updateFile)) {
                extractZip(updateFile, path.join(GetDataPath.getDir(), updateObj.targetDir))
            }
        }

        if (Settings.get('PhpCliVersion')) {
            const confPath = Php.getConfPath(Settings.get('PhpCliVersion'))
            const exePath = GetDataPath.getPhpExePath(Settings.get('PhpCliVersion'))
            Env.createBinFile(exePath, 'php', `-c "${confPath}"`)
        }

        return needRestart
    }

    /**
     *  Mac更新data目录下的文件
     * @param dirs
     */
    static async updateMacDataSubDir(dirs) {
        const coreDir = GetCorePath.getDir()
        for (const dir of dirs) {
            let source = path.join(coreDir, dir)
            if (!await DirUtil.Exists(source)) {
                continue
            }
            let target = path.join(MAC_DATA_DIR, dir)
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
    static async createUserSubDir(dirs) {
        for (const dir of dirs) {
            let p = path.join(GetDataPath.getDir(), dir)
            if (!await DirUtil.Exists(p)) {
                await DirUtil.Create(p)
            }
        }
    }

    /**
     * 将initFiles目录下的文件（和目录）移动到用户的目录，如果已存在，则跳过。
     * @param files
     */
    static async moveInitFiles(files = []) {
        let initFilesPath = path.join(GetCorePath.getDir(), InitFiles_DIR_NAME)
        for (const file of files) {
            const source = path.join(initFilesPath, file)
            const target = path.join(GetDataPath.getDir(), file)

            if (await FsUtil.Exists(target)) {
                FsUtil.Delete(source) //不捕捉错误
            } else {
                await FsUtil.Rename(source, target)
            }
        }
    }
}
