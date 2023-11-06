import {electronRequire} from '@/main/utils/electron';
import FileUtil from "@/main/utils/FileUtil";
import Path from "@/main/utils/Path";
import OS from "@/main/utils/OS";
import fs from "fs";
import Command from "@/main/utils/Command";
import {APP_NAME} from "@/shared/utils/constant";
import GetPath from "@/shared/utils/GetPath";

const app = electronRequire('app')

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
        if (FileUtil.Exists(envFilePath)) {
            if (!this.#canEditEnvFile()) {
                await Command.sudoExec(`chown ${userName}:staff ${envFilePath}`);
            }
            text = FileUtil.ReadAllText(envFilePath);
        } else {
            text = '';
        }

        if (enable) {
            let binPath  = GetPath.getBinDir();
            let appendText = `export PATH="${binPath}:$PATH"`;

            if (text.slice(-1) !== "\n") {
                appendText = "\n" + appendText;
            }
            FileUtil.AppendAllText(envFilePath, appendText);
        } else {
            let regx = new RegExp(`export\\s+PATH.+${APP_NAME}.+`, 'g');
            text = text.replaceAll(regx, '');
            FileUtil.WriteAllText(envFilePath, text);
        }
    }

    static async IsEnabled() {
        let envFilePath = this.getEnvFilePath();
        if (!FileUtil.Exists(envFilePath)) {
            return false;
        }
        let binPath  = GetPath.getBinDir();
        let text = FileUtil.ReadAllText(envFilePath);
        return text.includes(binPath);
    }

}
