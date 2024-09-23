import DirUtil from '@/main/utils/DirUtil'
import Path from '@/main/utils/Path'
import GetPath from '@/shared/utils/GetPath'
import {APP_NAME} from '@/shared/utils/constant'
import {isWindows} from '@/main/utils/utils'
import {EOL} from 'os'
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
        text = this.switchExtensionByText(version, text, extension, open, isZend)
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
     * @param version php version
     * @param originText {string}
     * @param extension {string} php扩展文件名，不含后缀
     * @param open {boolean}
     * @param isZend {boolean}
     * @returns {string}
     */
    static switchExtensionByText(version, originText, extension, open, isZend = false) {
        //(?<=\n);?extension\s*=\s*(php_)?mysqli(\.dll)?
        const confKey = isZend ? 'zend_extension' : 'extension'
        const fileExt = isWindows ? 'dll' : 'so'
        const regx = new RegExp(`(?<=\\n);?${confKey}\\s*=\\s*(php_)?${extension}(\\.${fileExt})?`)

        if (regx.test(originText)) {
            return originText.replace(regx, (match) => {
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
        } else {
            //没找到指定扩展的字符串，启用扩展时，新增它
            if (open) {
                return this.addExtensionByText(version, originText, extension, isZend)
            }
        }
        return originText
    }

    /**
     *
     * @param version php version
     * @param originText {string}
     * @param extension {string}
     * @param isZend
     * @returns {string}
     */
    static addExtensionByText(version, originText, extension, isZend = false) {
        const versionFloat = parseFloat(version)
        const confKey = isZend ? 'zend_extension' : 'extension'

        if (versionFloat <= 7.1) {
            if (isWindows && !extension.startsWith('php_')) {
                extension = `php_${extension}`
            }
            extension += isWindows ? '.dll' : '.so'
        } else {
            if (extension.startsWith('php_')) {
                extension = extension.replace('php_', '')
            }
        }
        const append = `${N}${confKey}=${extension}`

        if (originText.includes(append)) {
            return originText
        } else {
            return `${originText}${append}`
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
