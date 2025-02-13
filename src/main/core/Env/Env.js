import FileUtil from "@/main/utils/FileUtil";
import nodePath from 'path'
import GetDataPath from "@/shared/utils/GetDataPath";
import EnvMacOS from "@/main/core/Env/EnvMacOS";
import EnvWindows from "@/main/core/Env/EnvWindows";
import { isWindows, isMacOS } from '@/main/utils/utils'
import FsUtil from '@/main/utils/FsUtil'

export default class Env {
    /**
     * 创建符号链接或者.bat文件的到bin目录
     * @param targetPath
     * @param binName
     */
    static async createBinFile(targetPath, binName) {
        let binDirPath = GetDataPath.getBinDir();
        let path = nodePath.join(binDirPath, this.getBinFileName(binName));
        await this.deleteBinFile(binName);
        if (isWindows) {
            let text;
            if (binName === 'composer') {
                text = `@echo off\r\nphp "${targetPath}" %*`;
            } else {
                text = `@echo off\r\n"${targetPath}" %*`
            }
            await FileUtil.WriteAll(path, text);
        } else {
            if (binName === 'php') {
                await this.createOtherBinFile(targetPath, 'phpize', 'phpize');
            }
            await FsUtil.CreateSymbolicLink(path, targetPath);
        }
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
        return isWindows ? `${binName}.bat` : binName;
    }

    static async switch(enable) {
        if (isMacOS) {
            await EnvMacOS.switch(enable);
        } else if (isWindows) {
            await EnvWindows.switch(enable);
        }
    }
}
