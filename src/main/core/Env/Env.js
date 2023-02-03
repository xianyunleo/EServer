import File from "@/main/utils/File";
import Path from "@/main/utils/Path";
import OS from "@/main/core/OS";
import GetPath from "@/shared/utils/GetPath";
import EnvMacOS from "@/main/core/Env/EnvMacOS";
import EnvWindows from "@/main/core/Env/EnvWindows";

export default class Env {
    static createBinLink(targetPath, binName) {
        let path = Path.Join(GetPath.getBinPath(), binName);
        if (File.Exists(path)) {
            File.Delete(path);
        }
        File.CreateSymbolicLink(path, targetPath);
    }

    static deleteBinLink(binName) {
        let path = Path.Join(GetPath.getBinPath(), binName);
        if (File.Exists(path)) {
            File.Delete(path);
        }
    }

    static async switch(enable) {
        if (OS.isMacOS()) {
            await EnvMacOS.switch(enable);
        } else if (OS.isWindows()) {
            await EnvWindows.switch(enable);
        }
    }

    static IsEnabled() {
        if (OS.isMacOS()) {
            return EnvMacOS.IsEnabled();
        } else if (OS.isWindows()) {
            return EnvWindows.IsEnabled();
        }
        return false;
    }
}
