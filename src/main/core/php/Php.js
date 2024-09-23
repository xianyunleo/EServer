import DirUtil from '@/main/utils/DirUtil'
import Path from '@/main/utils/Path'
import GetPath from '@/shared/utils/GetPath'
import { APP_NAME } from '@/shared/utils/constant'
import { isWindows } from '@/main/utils/utils'
import { EOL } from 'os'
import FileUtil from '@/main/utils/FileUtil'

const N = EOL //换行符
export default class Php {
    /**
     * @param version {string} php版本
     * @param extension {string} php扩展文件名，不含后缀
     * @param open {boolean}
     * @param isZend {boolean}
     */
    static async switchExtension(version, extension, open, isZend) {
        const confPath = Php.getConfPath(version)
        let text = await FileUtil.ReadAll(confPath)
        text = this.switchExtensionByText(text, extension, open, isZend)
        await FileUtil.WriteAll(confPath, text)
    }

    static getConfDir(version) {
        const phpDir = GetPath.getPhpDir(version)
        return isWindows ? phpDir : Path.Join(phpDir, 'etc')
    }

    static getConfPath(version) {
        return Path.Join(this.getConfDir(version), 'php.ini')
    }

    /**
     *
     * @param originText {string}
     * @param extension {string} php扩展文件名，不含后缀
     * @param open {boolean}
     * @param isZend {boolean}
     * @returns {string}
     */
    static switchExtensionByText(originText, extension, open, isZend = false) {
        //(?<=\n);?extension\s*=\s*(php_)?mysqli(\.dll)?
        const confKey = isZend ? 'zend_extension' : 'extension'
        const fileExt = isWindows ? 'dll' : 'so'
        const regx = new RegExp(`(?<=\\n);?${confKey}\\s*=\\s*(php_)?${extension}(\\.${fileExt})?`)

        let newText = originText.replace(regx, (match) => {
            let replaceText = match.trim()
            if (open) {
                if (replaceText.charAt(0) === ';') {
                    replaceText = replaceText.replace(';', '')
                }
            } else {
                if (replaceText.charAt(0) !== ';') {
                    replaceText = `;${replaceText}`
                }
            }
            return replaceText
        })
        //启用扩展时，没找到指定扩展的字符串，新增它
        if (open && newText === originText) {
            newText = this.addExtensionByText(originText, extension, isZend)
        }

        return newText
    }

    /**
     *
     * @param originText {string}
     * @param extension {string}
     * @param isZend
     * @returns {string}
     */
    static addExtensionByText(originText, extension, isZend = false) {
        const confKey = isZend ? 'zend_extension' : 'extension'
        let command = `${N}${confKey}=${extension}`
        command += isWindows ? '.dll' : '.so'

        if (originText.includes(command)) {
            return originText
        } else {
            return `${originText}${command}`
        }
    }

    /**
     * 获取php扩展目录
     * @param phpVersion
     * @returns {string}
     */
    static async getExtensionDir(phpVersion) {
        if (isWindows) {
            let phpDir = GetPath.getPhpDir(phpVersion)
            return `${Path.Join(phpDir, 'ext')}`
        } else {
            let phpDir = GetPath.getPhpDir(phpVersion)
            let dirs = await DirUtil.GetDirectories(`${Path.Join(phpDir, 'lib/php/extensions')}`, 'no-debug-non-zts')
            return dirs[0]
        }
    }

    static getFpmConfTemplate(version) {
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
}
