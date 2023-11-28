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
    static createBinFile(targetPath, binName) {
        let binDirPath = GetPath.getBinDir();
        let path = Path.Join(binDirPath, this.getBinFileName(binName));
        this.deleteBinFile(binName);
        if (isWindows) {
            let text;
            if (binName === 'composer') {
                text = `@echo off\r\nphp "${targetPath}" %*`;
            } else {
                text = `@echo off\r\n"${targetPath}" %*`
            }
            FileUtil.WriteAllText(path, text);
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

    static deleteBinFile(binName) {
        let path = Path.Join(GetPath.getBinDir(), this.getBinFileName(binName));
        if (FileUtil.Exists(path)) {
            FileUtil.Delete(path);
        }
        if (!isWindows) {
            if (binName === 'php') {
                this.deleteOtherBinFile('phpize');
            }
        }
    }

    static deleteOtherBinFile(otherBinName) {
        let path = Path.Join(GetPath.getBinDir(), this.getBinFileName(otherBinName));
        if (FileUtil.Exists(path)) {
            FileUtil.Delete(path);
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
