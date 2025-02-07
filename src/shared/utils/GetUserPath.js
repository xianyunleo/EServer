import path from 'path'
import { MAC_USER_CORE_DIR, TEMP_DIR_NAME } from '@/main/utils/constant'
import { isDev, isMacOS, isWindows } from '@/main/utils/utils'
import GetCorePath from '@/shared/utils/GetCorePath'

/**
 * 用户（数据）目录
 */
export default class GetUserPath {
    static getDir() {
        if (isMacOS && !isDev) {
            return MAC_USER_CORE_DIR
        }
        return GetCorePath.getDir()
    }

    static getBinDir = () => path.join(this.getDir(), 'bin')

    static geTempDir = () => path.join(this.getDir(), TEMP_DIR_NAME)

    static getDownloadsDir = () => path.join(this.getDir(), 'downloads')


    static getSoftwareDir = () => path.join(this.getDir(), 'software')

    static getPhpTypeDir = () => path.join(this.getSoftwareDir(), 'php')


    static getServerTypeDir = () => path.join(this.getSoftwareDir(), 'server')

    static getToolTypeDir = () => path.join(this.getSoftwareDir(), 'tool')

    static getNginxDir = () => path.join(this.getServerTypeDir(), 'nginx')

    static getNginxConfDir = () => path.join(this.getNginxDir(), 'conf')

    static getNginxVhostsDir = () => path.join(this.getNginxConfDir(), 'vhosts')

    static getNginxRewriteDir = () => path.join(this.getNginxConfDir(), 'rewrite')

    static getNginxVhostsRewriteDir = () => path.join(this.getNginxVhostsDir(), 'rewrite')

    static getNginxVhostsSslDir = () => path.join(this.getNginxVhostsDir(), 'ssl')

    static getNginxLogsDir = () => path.join(this.getNginxDir(), 'logs')

    static getDatabaseDir = () => path.join(this.getDir(), 'database')

    static getPhpDir(version) {
        if (isMacOS && isDev) {
            return path.join(MAC_USER_CORE_DIR, `software/php/php-${version}`)
        }
        return path.join(this.getPhpTypeDir(), `php-${version}`)
    }

    static getPhpExePath(version) {
        if (isWindows) {
            return path.join(this.getPhpDir(version), 'php.exe')
        }
        return path.join(this.getPhpDir(version), 'bin/php')
    }

    static getComposerExePath = () => path.join(this.getToolTypeDir(), 'Composer/composer.phar')

    static getMysqlDir = (version) => path.join(this.getServerTypeDir(), `mysql-${version}`)

    static getMysqlDataDir = (version) => path.join(this.getDatabaseDir(), `mysql-${version}-data`)

    static getWebsiteDir = () => path.join(this.getDir(), 'www')
}
