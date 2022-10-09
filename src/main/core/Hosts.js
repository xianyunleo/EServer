import GetPath from "@/shared/utils/GetPath";
import fs from "fs";
import {fsExists, fsReadFile} from "@/main/utils/utils";
import {EOL} from "os";
import Command from "@/main/core/Command";

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
        let text = fsReadFile(path);
        let matches = text.match(/\n$/);
        let appendText = matches ? '' : EOL;

        for (const domain of domains) {
            if (domain) {
                appendText += `127.0.0.1 ${domain}${EOL}`;
            }
        }
        if (fsExists(path) && !Hosts.canEditHosts()) {
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
        if (!fsExists(path)) {
            return;
        }
        if (!Hosts.canEditHosts()) {
            await Command.sudoExec(`chmod 666 ${path}`);
        }
        let text = fsReadFile(path);
        for (const domain of domains) {
            if(domain){
                let regx = new RegExp('.*' + domain.replaceAll('.', '\\.') + '\\s*','g');
                text = text.replaceAll(regx, '');
            }
        }
        fs.writeFileSync(path, text);
    }
}
