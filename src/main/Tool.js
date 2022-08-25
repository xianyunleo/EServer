import Command from "@/main/Command";
import {shell} from "@electron/remote"

export default class Tool {
    static async openTextFile(filePath, isSudo = false) {
        if (!await Tool.vscodeIsInstalled()) {
            throw new Error('VS Code没有安装');
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

    /**
     *
     * @returns {Promise<boolean>}
     */
    static async vscodeIsInstalled() {
        let command = "which code";
        try {
            let output = await Command.exec(command);
            return output && output.trim() !== '';
        } catch {
            return false;
        }
    }

    static async openUrl(url) {
        return await shell.openExternal(url);
    }
}


