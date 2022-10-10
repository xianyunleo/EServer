import GetPath from "@/shared/utils/GetPath";
import fs from "fs";
import {EOL} from "os";
import Command from "@/main/core/Command";
import File from "@/main/utils/File";

export default class Hosts {
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

    /**
     *
     * @param domains {array}
     */
    static async add(domains) {
        let path = GetPath.getHostsPath();
        let text = File.ReadAllText(path);
        let matches = text.match(/\n$/);
        let appendText = matches ? '' : EOL;

        for (const domain of domains) {
            if (domain) {
                appendText += `127.0.0.1 ${domain}${EOL}`;
            }
        }
        if (File.Exists(path) && !Hosts.canEditHosts()) {
            await Command.sudoExec(`chmod 666 ${path}`);
        }
        fs.appendFileSync(path, appendText); //如果文件不存在，则创建改文件
    }

    /**
     *
     * @param domains {array}
     */
    static async delete(domains) {
        let path = GetPath.getHostsPath();
        if (!File.Exists(path)) {
            return;
        }
        if (!Hosts.canEditHosts()) {
            await Command.sudoExec(`chmod 666 ${path}`);
        }
        let text = File.ReadAllText(path);
        for (const domain of domains) {
            if(domain){
                let regx = new RegExp('.*' + domain.replaceAll('.', '\\.') + '\\s*','g');
                text = text.replaceAll(regx, '');
            }
        }
        fs.writeFileSync(path, text);
    }
}
