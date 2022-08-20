import fs from "fs";
import is from "electron-is";
import Tool from "@/main/Tool";
import Command from "@/main/Command";
import fixPath from 'fix-path';

export default class Hosts {
    static async openHosts() {
        if (is.macOS()) {
            fixPath();  //mac下修复环境变量不识别的问题
        }
        let path = Hosts.getHostsPath();

        if (is.windows()) {
            return await Tool.openTextFile(path);
        } else {
            if (!await Hosts.canEditHosts()) {
                await Command.sudoExec(`chmod 666 ${path}`);
            }
            return await Tool.openTextFile(path);
        }
    }

    /**
     *
     * @returns {Promise<boolean>}
     */
    static async canEditHosts() {
        let path = Hosts.getHostsPath();
        try {
            await fs.promises.access(path, fs.constants.R_OK | fs.constants.W_OK);
            return true;
        } catch {
            return false;
        }
    }

    /**
     *
     * @returns {string}
     */
    static getHostsPath() {
        if (is.windows()) {
            return 'C:\\Windows\\System32\\drivers\\etc\\hosts';
        } else {
            return '/etc/hosts';
        }
    }
}




