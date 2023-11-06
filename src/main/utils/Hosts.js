import GetPath from "@/shared/utils/GetPath";
import fs from "fs";
import {EOL} from "os";
import Command from "@/main/utils/Command";
import FileUtil from "@/main/utils/FileUtil";

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
     * 添加一条127.0.0.1的host，已有则不添加
     * @param domain {string}
     */
    static async add(domain) {
        let path = GetPath.getHostsPath();
        let text = FileUtil.ReadAllText(path);

        let domainRegx = this.getDomainRegExp(domain);
        if (text.match(domainRegx)) {
            return;
        }

        let matches = text.match(/\n$/);
        let appendText = matches ? '' : EOL;

        appendText += `127.0.0.1 ${domain}${EOL}`;

        if (FileUtil.Exists(path) && !Hosts.canEditHosts()) {
            await Command.sudoExec(`chmod 666 ${path}`);
        }
        FileUtil.AppendAllText(path, appendText);
    }

    /**
     * 删除一条127.0.0.1的host
     * @param domain {string}
     */
    static async delete(domain) {
        let path = GetPath.getHostsPath();
        if (!FileUtil.Exists(path)) {
            return;
        }
        if (!Hosts.canEditHosts()) {
            await Command.sudoExec(`chmod 666 ${path}`);
        }
        let text = FileUtil.ReadAllText(path);
        let domainRegx = this.getDomainRegExp(domain);
        text = text.replaceAll(domainRegx, '');
        FileUtil.WriteAllText(path, text);
    }

    static getDomainRegExp(domain) {
        return new RegExp('.*127\\.0\\.0\\.1.*' + domain.replaceAll('.', '\\.') + '\\s*', 'g');
    }
}
