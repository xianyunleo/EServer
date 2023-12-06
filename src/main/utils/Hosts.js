import GetPath from "@/shared/utils/GetPath";
import {EOL} from "os";
import FileUtil from "@/main/utils/FileUtil";
import FsUtil from '@/main/utils/FsUtil'

export default class Hosts {
    /**
     * 添加一条127.0.0.1的host，已有则不添加
     * @param domain {string}
     */
    static async add(domain) {
        let path = GetPath.getHostsPath();
        let text = await FileUtil.ReadAll(path);

        let domainRegx = this.getDomainRegExp(domain);
        if (text.match(domainRegx)) {
            return;
        }

        let matches = text.match(/\n$/);
        let appendText = matches ? '' : EOL;

        appendText += `127.0.0.1 ${domain}${EOL}`;

        if (await FileUtil.Exists(path) && !await FsUtil.CanReadWrite(path)) {
            await FsUtil.ChmodReadWrite(path)
        }
        await FileUtil.Append(path, appendText);
    }

    /**
     * 删除一条127.0.0.1的host
     * @param domain {string}
     */
    static async delete(domain) {
        if (domain === 'localhost') return
        let path = GetPath.getHostsPath();
        if (!await FileUtil.Exists(path)) {
            return;
        }
        if (!await FsUtil.CanReadWrite(path)) {
            await FsUtil.ChmodReadWrite(path)
        }
        let text = await FileUtil.ReadAll(path);
        let domainRegx = this.getDomainRegExp(domain);
        text = text.replaceAll(domainRegx, '');
        await FileUtil.WriteAll(path, text);
    }

    static getDomainRegExp(domain) {
        return new RegExp('.*127\\.0\\.0\\.1.*' + domain.replaceAll('.', '\\.') + '\\s*', 'g');
    }
}
