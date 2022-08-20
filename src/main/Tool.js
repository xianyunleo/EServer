import Command from "@/main/Command";
import {shell} from "@electron/remote"

export default class Tool {
    static async openTextFile(filePath, isSudo = false) {
        if (!await Tool.vscodeIsInstalled()) {
            throw new Error('vscode没有安装');
        }
        let command = `code ${filePath}`;
        if (isSudo) {
            return await Command.sudoExec(command);
        } else {
            return await Command.exec(command);
        }
    }

    static openPath(path) {
        shell.openPath(path);
    }

    static async vscodeIsInstalled() {
        let command = "code -v";
        let output = await Command.exec(command);
        let reg = /\d+\.\d+\.\d+/;
        return reg.test(output)
    }

    static async openUrl(url) {
        return await shell.openExternal(url);
    }
}


