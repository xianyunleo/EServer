import {app} from '@electron/remote';
import File from "@/main/utils/File";
import Path from "@/main/utils/Path";
import OS from "@/main/core/OS";
import fs from "fs";
import Command from "@/main/core/Command";
import {APP_NAME} from "@/shared/constant";
import GetPath from "@/shared/utils/GetPath";

export default class EnvMacOS {
    static #EnvFileName = '.zshrc';

    static #canEditEnvFile() {
        let path = this.getEnvFilePath();
        try {
            fs.accessSync(path, fs.constants.R_OK | fs.constants.W_OK);
            return true;
        } catch {
            return false;
        }
    }

    static getEnvFilePath() {
        return Path.Join(app.getPath('home'), this.#EnvFileName);
    }

    static async switch(enable) {
        let envFilePath = this.getEnvFilePath();
        let userName = OS.getUserName();
        let text;
        if (File.Exists(envFilePath)) {
            if (!this.#canEditEnvFile()) {
                await Command.sudoExec(`chown ${userName}:staff ${envFilePath}`);
            }
            text = File.ReadAllText(envFilePath);
        } else {
            text = '';
        }

        if (enable) {
            let binPath  = GetPath.getBinPath();
            let appendText = `export PATH="${binPath}:$PATH"`;

            if (text.slice(-1) !== "\n") {
                appendText = "\n" + appendText;
            }
            File.AppendAllText(envFilePath, appendText);
        } else {
            let regx = new RegExp(`export\\s+PATH.+${APP_NAME}.+`, 'g');
            text = text.replaceAll(regx, '');
            File.WriteAllText(envFilePath, text);
        }
    }

    static async IsEnabled() {
        let envFilePath = this.getEnvFilePath();
        if (!File.Exists(envFilePath)) {
            return false;
        }
        let binPath  = GetPath.getBinPath();
        let text = File.ReadAllText(envFilePath);
        return text.includes(binPath);
    }

}
