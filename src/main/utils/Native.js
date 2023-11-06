import { electronRequire } from '@/main/utils/electron'
import Command from "@/main/utils/Command";
import MessageBox from "@/renderer/utils/MessageBox";
import fixPath from "fix-path";
import Hosts from "@/main/utils/Hosts";
import GetPath from "@/shared/utils/GetPath";
import FileUtil from "@/main/utils/FileUtil";
import Settings from "@/main/Settings";
import fs from "fs";
import { isMacOS, isWindows } from '@/main/utils/utils'

const shell = electronRequire('shell')

export default class Native {
    /**
     *
     * @param path {string}
     * @returns {Promise<void>}
     */
    static async openApp(path) {
        if(isWindows){
            Native.openExternal(path)
        }else if(isMacOS){
            await Command.exec(`open -a "${path}"`)
        }else {
            throw new Error(`todo`)
        }
    }
    /**
     *
     * @param filePath {string}
     * @returns {Promise<void>}
     */
    static async openTextFile(filePath) {
        if (isMacOS) {
            fixPath()  //mac下修复环境变量不识别的问题
        }
        try {
            if (!FileUtil.Exists(filePath)) {
                throw new Error(`${filePath} 文件不存在`)
            }

            let editorPath = Settings.get('TextEditor')
            //mac app是目录，Windows是文件，所以这里用existsSync方法
            if (!fs.existsSync(editorPath)) {
                throw new Error(`${editorPath} 不存在！\n请重新设置文本编辑器`)
            }
            let command
            if (isMacOS) {
                command = `open -a "${editorPath}"  "${filePath}"`
            } else if (isWindows) {
                command = `"${editorPath}" "${filePath}"`
            }
            await Command.exec(command)

        } catch (error) {
            //todo渲染进程捕捉错误
            MessageBox.error(error.message ?? error, '打开文件出错！')
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
        if(isWindows){
            return await shell.openExternal(path);
        }
        return await shell.openPath(path);
    }

    static async openUrl(url) {
        return await shell.openExternal(url);
    }

    static async openHosts() {
        let path = GetPath.getHostsPath();
        if (isWindows) {
            await Native.openTextFile(path);
        } else {
            if (!Hosts.canEditHosts()) {
                await Command.sudoExec(`chmod 666 ${path}`);
            }
            await Native.openTextFile(path);
        }
    }

}
