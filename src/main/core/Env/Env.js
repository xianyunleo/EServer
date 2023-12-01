import FileUtil from "@/main/utils/FileUtil";
import Path from "@/main/utils/Path";
import GetPath from "@/shared/utils/GetPath";
import EnvMacOS from "@/main/core/Env/EnvMacOS";
import EnvWindows from "@/main/core/Env/EnvWindows";
import { isWindows, isMacOS } from '@/main/utils/utils'

export default class Env {
    /**
     * 创建符号链接或者.bat文件的到bin目录
     * @param targetPath
     * @param binName
     */
    static async createBinFile(targetPath, binName) {
        let binDirPath = GetPath.getBinDir();
        let path = Path.Join(binDirPath, this.getBinFileName(binName));
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
                this.createOtherBinFile(targetPath, 'phpize', 'phpize');
            }
            FileUtil.CreateSymbolicLink(path, targetPath);
        }
    }

    static createOtherBinFile(targetPath, targetOtherFileName, otherBinName) {
        let binDirPath = GetPath.getBinDir();
        let path = Path.Join(binDirPath, otherBinName);
        let targetOtherFilePath = Path.Join(Path.GetDirectoryName(targetPath), targetOtherFileName);
        FileUtil.CreateSymbolicLink(path, targetOtherFilePath);
    }

    static async deleteBinFile(binName) {
        let path = Path.Join(GetPath.getBinDir(), this.getBinFileName(binName));
        if (await FileUtil.Exists(path)) {
            await FileUtil.Delete(path);
        }
        if (!isWindows) {
            if (binName === 'php') {
                await this.deleteOtherBinFile('phpize');
            }
        }
    }

    static async deleteOtherBinFile(otherBinName) {
        let path = Path.Join(GetPath.getBinDir(), this.getBinFileName(otherBinName));
        if (await FileUtil.Exists(path)) {
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
