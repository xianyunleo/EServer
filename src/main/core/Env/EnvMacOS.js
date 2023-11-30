import {electronRequire} from '@/main/utils/electron';
import FileUtil from "@/main/utils/FileUtil";
import Path from "@/main/utils/Path";
import OS from "@/main/utils/OS";
import Command from "@/main/utils/Command";
import {APP_NAME} from "@/shared/utils/constant";
import GetPath from "@/shared/utils/GetPath";
import FsUtil from '@/main/utils/FsUtil'

const app = electronRequire('app')

export default class EnvMacOS {
    static _envFileName = '.zshrc';

    static getEnvFilePath() {
        return Path.Join(app.getPath('home'), this._envFileName);
    }

    static async switch(enable) {
        let envFilePath = this.getEnvFilePath();
        let userName = OS.getUserName();
        let text;

        if (!FileUtil.Exists(envFilePath)) {
            FileUtil.WriteAllText(envFilePath, '')
        }

        if (!await FsUtil.CanReadWrite(envFilePath)) {
            //envFile正常是可以编辑的，考虑到own变成root的情况
            await Command.sudoExec(`chown ${userName}:staff ${envFilePath}`)
        }

        text = FileUtil.ReadAllText(envFilePath);

        if (enable) {
            let binPath  = GetPath.getBinDir();
            let appendText = `export PATH="${binPath}:$PATH"`;

            if (text.slice(-1) !== '\n') {
                appendText = `\n${appendText}`
            }
            await FileUtil.AppendAllText(envFilePath, appendText);
        } else {
            let regx = new RegExp(`export\\s+PATH.+${APP_NAME}.+`, 'g');
            text = text.replaceAll(regx, '');
            FileUtil.WriteAllText(envFilePath, text);
        }
    }

}
