import Command from "@/main/core/Command";
import {shell} from "@electron/remote";
import MessageBox from "@/renderer/utils/MessageBox";
import is from "electron-is";
import fixPath from "fix-path";
import Hosts from "@/main/core/Hosts";
import fs from "fs";
import GetPath from "@/shared/utils/GetPath";

export default class Native {
    static async openTextFile(filePath, isSudo = false) {
        try {
            if (!await Native.vscodeIsInstalled()) {
                throw new Error('VS Code没有安装');
            }
            let command = `code ${filePath}`;
            if (isSudo) {
                await Command.sudoExec(command);
            } else {
                await Command.exec(command);
            }
        } catch (error) {
            MessageBox.error(error.message ? error.message : error, '打开文件出错！');
        }

    }

    static async openPath(path) {
        await shell.openPath(path);
    }

    static async openUrl(url) {
        return await shell.openExternal(url);
    }

    static async vscodeIsInstalled() {
        let command = "which code";
        try {
            let output = await Command.exec(command);
            return output && output.trim() !== '';
        } catch {
            return false;
        }
    }

    static async openHosts() {
        if (is.macOS()) {
            fixPath();  //mac下修复环境变量不识别的问题
        }
        let path = Hosts.getHostsPath();

        if (is.windows()) {
            await Native.openTextFile(path);
        } else {
            if (!await Hosts.canEditHosts()) {
                await Command.sudoExec(`chmod 666 ${path}`);
            }
            await Native.openTextFile(path);
        }
    }

    /**
     *
     * @returns {boolean}
     */
    static canEditHosts() {
        let path = GetPath.getHostsPath();
        try {
            fs.accessSync(path, fs.constants.R_OK | fs.constants.W_OK);
            return true;
        } catch {
            return false;
        }
    }
}