import Command from "@/main/core/Command";
import {shell} from "@electron/remote";
import MessageBox from "@/renderer/utils/MessageBox";
import fixPath from "fix-path";
import Hosts from "@/main/core/Hosts";
import GetPath from "@/shared/utils/GetPath";
import File from "@/main/utils/File";
import OS from "@/main/core/OS";
import Settings from "@/main/Settings";
import fs from "fs";

export default class Native {
    /**
     *
     * @param filePath {string}
     * @returns {Promise<void>}
     */
    static async openTextFile(filePath) {
        if (OS.isMacOS()) {
            fixPath();  //mac下修复环境变量不识别的问题
        }
        try {
            if (!File.Exists(filePath)) {
                throw new Error('文件不存在');
            }

            let editorPath = Settings.get('TextEditor');
            //mac app是目录，Windows是文件，所以这里用existsSync方法
            if (!fs.existsSync(editorPath)) {
                throw new Error(`${editorPath} 不存在！`);
            }
            let command;
            if(OS.isMacOS()){
                command = `open -a "${editorPath}"  "${filePath}"`;
            }else if(OS.isWindows()){
                command = `${editorPath} "${filePath}"`;
            }
            await Command.exec(command);

        } catch (error) {
            MessageBox.error(error.message ?? error, '打开文件出错！');
        }

    }

    static async openPath(path) {
        return await shell.openPath(path);
    }

    static async showItemInFolder(path) {
        await shell.showItemInFolder(path);
    }

    static async openExternal(path) {
        return await shell.openExternal(path);
    }

    static async openDirectory(path) {
        if(OS.isWindows()){
            return await shell.openExternal(path);
        }
        return await shell.openPath(path);
    }

    static async openUrl(url) {
        return await shell.openExternal(url);
    }

    static async openHosts() {
        let path = GetPath.getHostsPath();
        if (OS.isWindows()) {
            await Native.openTextFile(path);
        } else {
            if (!Hosts.canEditHosts()) {
                await Command.sudoExec(`chmod 666 ${path}`);
            }
            await Native.openTextFile(path);
        }
    }

}
