import {app} from '@electron/remote';
import File from "@/main/utils/File";
import Path from "@/main/utils/Path";
import OS from "@/main/core/OS";
import fs from "fs";
import Command from "@/main/core/Command";
import {APP_NAME} from "@/shared/constant";
import GetPath from "@/shared/utils/GetPath";

export default class Env {
    static #EnvFileName = '.zshrc';

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
            await Env.switchMacOS(enable);
        }
    }

    static IsEnabled() {
        if (OS.isMacOS()) {
            return Env.IsEnabledMacOS();
        }
    }

    static IsEnabledMacOS() {
        let envFilePath = Env.getEnvFilePath();
        if (!File.Exists(envFilePath)) {
            return false;
        }
        let text = File.ReadAllText(envFilePath);
        let regx = new RegExp('export\\s+PATH.+' + APP_NAME + '.+', 'g');
        return regx.test(text);
    }

    static async switchMacOS(enable) {
        let envFilePath = Env.getEnvFilePath();
        let userName = OS.getUserName();
        let text;
        if (File.Exists(envFilePath)) {
            if (!Env.canEditEnvFile()) {
                await Command.sudoExec(`chown ${userName}:staff ${envFilePath}`);
            }
            text = File.ReadAllText(envFilePath);
        } else {
            text = '';
        }

        if (enable) {
            let appendText = `export PATH="/Applications/${APP_NAME}/bin:$PATH"`;

            if (text.slice(-1) !== "\n") {
                appendText = "\n" + appendText;
            }
            File.AppendAllText(envFilePath, appendText);
        } else {
            let regx = new RegExp('export\\s+PATH.+' + APP_NAME + '.+', 'g');
            text = text.replaceAll(regx, '');
            File.WriteAllText(envFilePath, text);
        }
    }

    static canEditEnvFile() {
        let path = Env.getEnvFilePath();
        try {
            fs.accessSync(path, fs.constants.R_OK | fs.constants.W_OK);
            return true;
        } catch {
            return false;
        }
    }

    static getEnvFilePath() {
        return Path.Join(app.getPath('home'), Env.#EnvFileName);
    }
}
