import Command from "@/main/Command";
import {shell} from "@electron/remote"

export default class Tool {
    static async openTextFile(filePath, isSudo = false) {
        if (!await Tool.vscodeIsInstalled()) {
            throw new Error('VS Code没有安装');
        }
        let command = `code ${filePath}`;
        if (isSudo) {
            await Command.sudoExec(command);
        } else {
            await Command.exec(command);
        }
    }

    static async openPath(path) {
        await shell.openPath(path);
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


