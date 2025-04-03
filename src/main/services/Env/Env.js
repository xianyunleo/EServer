import FileUtil from '@/main/utils/FileUtil'
import nodePath from 'path'
import GetDataPath from '@/shared/utils/GetDataPath'
import EnvMacOS from '@/main/services/Env/EnvMacOS'
import EnvWindows from '@/main/services/Env/EnvWindows'
import { isWindows, isMacOS } from '@/main/utils/utils'
import FsUtil from '@/main/utils/FsUtil'
import Shell from '@/main/utils/Shell'

export default class Env {
    /**
     * 创建符号链接或者.bat文件的到bin目录
     * @param targetPath
     * @param binName
     * @param args
     */
    static async createBinFile(targetPath, binName, args = '') {
        let binDirPath = GetDataPath.getBinDir()
        let path = nodePath.join(binDirPath, this.getBinFileName(binName))
        await this.deleteBinFile(binName)
        let text = `"${targetPath}" ${args}`

        if (isWindows) {
            if (binName === 'composer') {
                text = `@echo off\r\nphp ${text} %*`
            } else {
                text = `@echo off\r\n${text} %*`
            }
        } else {
            text = `#!/bin/bash\n${text} $@`
            if (binName === 'php') {
                await this.createOtherBinFile(targetPath, 'phpize', 'phpize');
            }
        }
        await FileUtil.WriteAll(path, text)
        if (!isWindows) await Shell.sudoExec(`chmod +x ${path}`)
    }

    static async createOtherBinFile(targetPath, targetOtherFileName, otherBinName) {
        let binDirPath = GetDataPath.getBinDir()
        let path = nodePath.join(binDirPath, otherBinName)
        let targetOtherFilePath = nodePath.join(nodePath.dirname(targetPath), targetOtherFileName)
        await FsUtil.CreateSymbolicLink(path, targetOtherFilePath)
    }

    static async deleteBinFile(binName) {
        let path = nodePath.join(GetDataPath.getBinDir(), this.getBinFileName(binName))
        if (await FsUtil.Exists(path)) {
            await FileUtil.Delete(path)
        }
        if (!isWindows) {
            if (binName === 'php') {
                await this.deleteOtherBinFile('phpize')
            }
        }
    }

    static async deleteOtherBinFile(otherBinName) {
        let path = nodePath.join(GetDataPath.getBinDir(), this.getBinFileName(otherBinName))
        if (await FsUtil.Exists(path)) {
            await FileUtil.Delete(path);
        }
    }

    static getBinFileName(binName) {
        return isWindows ? `${binName}.bat` : binName
    }

    static async switch(enable) {
        if (isMacOS) {
            await EnvMacOS.switch(enable);
        } else if (isWindows) {
            await EnvWindows.switch(enable);
        }
    }
}
