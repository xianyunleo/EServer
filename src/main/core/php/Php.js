import DirUtil from '@/main/utils/DirUtil'
import path from 'path'
import GetDataPath from '@/shared/utils/GetDataPath'
import { APP_NAME } from '@/shared/utils/constant'
import { isWindows } from '@/main/utils/utils'
import { EOL } from 'os'
import FileUtil from '@/main/utils/FileUtil'

const N = EOL //换行符
export default class Php {
    /**
     * @param version {string} php版本
     * @param extension {string} php扩展文件名，不含后缀
     * @param isZend {boolean}
     */
    static async addExtension(version, extension, isZend = false) {
        const confPath = Php.getConfPath(version)
        let text = await FileUtil.ReadAll(confPath)
        text = this.addExtensionByText(version, text, extension, isZend)
        await FileUtil.WriteAll(confPath, text)
    }

    static getConfDir(version) {
        const etcDir = path.join(GetDataPath.getEtcDir(), `php-${version}`)
        return isWindows ? etcDir : path.join(etcDir, 'etc')
    }

    static getConfPath(version) {
        return path.join(this.getConfDir(version), 'php.ini')
    }

    /**
     * 开关扩展，复用已注释的扩展配置，通常用于初始化Windows的php.ini文件
     * @param version php version
     * @param originText {string}
     * @param extension {string} php扩展文件名，不含后缀
     * @param open {boolean}
     * @param isZend {boolean}
     * @returns {string}
     */
    static switchExtensionByText(version, originText, extension, open, isZend = false) {
        const confKey = isZend ? 'zend_extension' : 'extension'
        const fileExt = isWindows ? 'dll' : 'so'
        //(?<=\n);?extension\s*=\s*(php_)?mysqli(\.dll)?
        const regx = new RegExp(`(?<=\\n);?${confKey}\\s*=\\s*(php_)?${extension}(\\.${fileExt})?`)

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
    }

    /**
     * 增加一行扩展配置，检查重复，不复用已注释的扩展配置
     * @param version php version
     * @param originText {string}
     * @param extension {string}
     * @param isZend
     * @returns {string}
     */
    static addExtensionByText(version, originText, extension, isZend = false) {
        const versionFloat = parseFloat(version)
        const confKey = isZend ? 'zend_extension' : 'extension'
        const fileExt = isWindows ? 'dll' : 'so'
        //(?<=\n)extension\s*=\s*(php_)?mysqli(\.dll)?  和switchExtensionByText正则的区别是，不判断开头的";"
        const regx = new RegExp(`(?<=\\n)${confKey}\\s*=\\s*(php_)?${extension}(\\.${fileExt})?`)
        if (regx.test(originText)) {
            return originText
        }

        if (isWindows) {
            if (versionFloat <= 7.1) {
                if (!extension.startsWith('php_')) {
                    extension = `php_${extension}`
                }
                extension += `.${fileExt}`
            } else {
                if (extension.startsWith('php_')) {
                    extension = extension.replace('php_', '')
                }
            }
        } else {
            if (versionFloat <= 7.1) {
                extension += `.${fileExt}`
            }
        }

        const append = `${N}${confKey}=${extension}`

        return `${originText}${append}`
    }

    /**
     * 获取php扩展目录
     * @param phpVersion
     * @returns {string}
     */
    static async getExtensionDir(phpVersion) {
        if (isWindows) {
            let phpDir = GetDataPath.getPhpDir(phpVersion)
            return `${path.join(phpDir, 'ext')}`
        } else {
            let phpDir = GetDataPath.getPhpDir(phpVersion)
            let dirs = await DirUtil.GetDirectories(`${path.join(phpDir, 'lib/php/extensions')}`, 'no-debug-non-zts')
            return dirs[0]
        }
    }

    static getFpmConfTemplate(version) {
        return `[global]
pid = /Applications/${APP_NAME}/childApp/php/php-${version}/var/run/php-fpm.pid
error_log = /Applications/${APP_NAME}/childApp/php/php-${version}/var/log/php-fpm.log
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
