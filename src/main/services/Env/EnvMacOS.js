import FileUtil from "@/main/utils/FileUtil";
import path from "path";
import OS from "@/main/utils/OS";
import Shell from "@/main/utils/Shell";
import {APP_NAME} from "@/shared/utils/constant";
import FsUtil from '@/main/utils/FsUtil'
import GetDataPath from "@/shared/utils/GetDataPath";

export default class EnvMacOS {
    static _envFileName = '.zshrc';

    static getEnvFilePath() {
        return path.join(OS.getHomeDir(), this._envFileName);
    }

    static async switch(enable) {
        let envFilePath = this.getEnvFilePath();
        let userName = OS.getUserName();
        let text;

        if (!await FileUtil.Exists(envFilePath)) {
            await FileUtil.WriteAll(envFilePath, '')
        }

        if (!await FsUtil.CanReadWrite(envFilePath)) {
            //envFile正常是可以编辑的，考虑到own变成root的情况
            await Shell.sudoExec(`chown ${userName}:staff ${envFilePath}`)
        }

        text = await FileUtil.ReadAll(envFilePath);

        if (enable) {
            let binPath  = GetDataPath.getBinDir();
            let appendText = `export PATH="${binPath}:$PATH"`;

            if (text.slice(-1) !== '\n') {
                appendText = `\n${appendText}`
            }
            await FileUtil.Append(envFilePath, appendText);
        } else {
            let regx = new RegExp(`export\\s+PATH.+${APP_NAME}.+`, 'g');
            text = text.replaceAll(regx, '');
            await FileUtil.WriteAll(envFilePath, text);
        }
    }

}
