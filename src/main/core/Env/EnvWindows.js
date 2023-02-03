import {app} from '@electron/remote';
import File from "@/main/utils/File";
import Path from "@/main/utils/Path";
import OS from "@/main/core/OS";
import fs from "fs";
import Command from "@/main/core/Command";
import {APP_NAME} from "@/shared/constant";
import GetPath from "@/shared/utils/GetPath";

export default class EnvWindows {
    static async switch(enable) {
        if (enable) {
            let binPath = GetPath.getBinPath();
            let cammand = `setx PATH "%PATH%;${binPath}"`;
            await Command.exec(cammand);
        } else {
            let regx = new RegExp('export\\s+PATH.+' + APP_NAME + '.+', 'g');
            text = text.replaceAll(regx, '');
            File.WriteAllText(envFilePath, text);
        }
    }

    static IsEnabled() {
        let envFilePath = this.#getEnvFilePath();
        if (!File.Exists(envFilePath)) {
            return false;
        }
        let text = File.ReadAllText(envFilePath);
        let regx = new RegExp('export\\s+PATH.+' + APP_NAME + '.+', 'g');
        return regx.test(text);
    }

}
