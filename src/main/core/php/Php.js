import DirUtil from "@/main/utils/DirUtil";
import Path from "@/main/utils/Path";
import GetPath from "@/shared/utils/GetPath";
import { APP_NAME } from '@/shared/utils/constant'
import { isWindows } from '@/main/utils/utils'

export default class Php {
    static getFpmConfText(version) {
        return `[global]
pid = /Applications/${APP_NAME}/software/php/php-${version}/var/run/php-fpm.pid
error_log = /Applications/${APP_NAME}/software/php/php-${version}/var/log/php-fpm.log
log_level = notice

[www]
listen = /tmp/php-cgi-${version}.sock
listen.mode = 0666
pm = dynamic
pm.max_children = 5
pm.start_servers = 2
pm.min_spare_servers = 1
pm.max_spare_servers = 3
`
    }

    /**
     *
     * @param originText {string}
     * @param extension {string}
     * @param open {boolean}
     * @returns {string}
     */
    static getSwitchExtensionConfText(originText, extension, open) {
        //(?<=\n);?.?extension\s*=\s*bz2.*
        let regx = new RegExp(`(?<=\\n);?.?extension\\s*=\\s*${extension}.*`);

        return originText.replace(regx, (match) => {
            let replaceText = match.trim();
            if (open) {
                if (replaceText.charAt(0) === ';') {
                    replaceText = replaceText.replace(';', '');
                }
            } else {
                if (replaceText.charAt(0) !== ';') {
                    replaceText = `;${replaceText}`;
                }
            }
            return replaceText;
        });
    }

    /**
     * 获取php扩展目录
     * @param phpVersion
     * @returns {string}
     */
    static async getExtensionDir(phpVersion) {
        if (isWindows) {
            let phpDir = GetPath.getPhpDir(phpVersion);
            return `${Path.Join(phpDir, 'ext')}`;
        } else {
            let phpDir = GetPath.getPhpDir(phpVersion);
            let dirs = await DirUtil.GetDirectories(`${Path.Join(phpDir, 'lib/php/extensions')}`, 'no-debug-non-zts');
            return dirs[0];
        }
    }
}
