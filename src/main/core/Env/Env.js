import File from "@/main/utils/File";
import Path from "@/main/utils/Path";
import OS from "@/main/core/OS";
import GetPath from "@/shared/utils/GetPath";
import EnvMacOS from "@/main/core/Env/EnvMacOS";
import EnvWindows from "@/main/core/Env/EnvWindows";

export default class Env {
    /**
     * 创建符号链接或者.bat文件的到bin目录
     * @param targetPath
     * @param binName
     */
    static createBinFile(targetPath, binName) {
        let binDirPath = GetPath.getBinPath();
        let path = Path.Join(binDirPath, this.getBinFileName(binName));
        if (File.Exists(path)) {
            File.Delete(path);
        }
        if (OS.isWindows()) {
            let text;
            if (binName === 'composer') {
                text = `@echo off\r\nphp "${targetPath}" %*`;
            } else {
                text = `@echo off\r\n"${targetPath}" %*`
            }
            File.WriteAllText(path, text);
        } else {
            if (binName === 'php') {
                this.createSameLevelOtherBinFile(targetPath, 'phpize', 'phpize');
            }
            File.CreateSymbolicLink(path, targetPath);
        }
    }

    static createSameLevelOtherBinFile(targetPath, targetOtherFileName, otherBinName) {
        let binDirPath = GetPath.getBinPath();
        let path = Path.Join(binDirPath, otherBinName);
        let targetOtherFilePath = Path.Join(Path.GetDirectoryName(targetPath), targetOtherFileName);
        File.CreateSymbolicLink(path, targetOtherFilePath);
    }

    static deleteBinFile(binName) {
        let path = Path.Join(GetPath.getBinPath(), this.getBinFileName(binName));
        console.log(path)
        if (File.Exists(path)) {
            File.Delete(path);
        }
    }

    static getBinFileName(binName) {
        return OS.isWindows() ? `${binName}.bat` : binName;
    }

    static async switch(enable) {
        if (OS.isMacOS()) {
            await EnvMacOS.switch(enable);
        } else if (OS.isWindows()) {
            await EnvWindows.switch(enable);
        }
    }

    static async IsEnabled() {
        if (OS.isMacOS()) {
            return await EnvMacOS.IsEnabled();
        } else if (OS.isWindows()) {
            return await EnvWindows.IsEnabled();
        }
        return false;
    }
}
