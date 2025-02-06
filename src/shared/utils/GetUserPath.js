import path from 'path'
import { MAC_USER_CORE_DIR, TEMP_DIR_NAME } from '@/main/utils/constant'
import { isDev, isMacOS, isWindows } from '@/main/utils/utils'
import Settings from '@/main/Settings'
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

    static getBinDir() {
        return path.join(this.getDir(), 'bin')
    }

    static geTempDir() {
        return path.join(this.getDir(), TEMP_DIR_NAME)
    }

    static getDownloadsDir() {
        return path.join(this.getDir(), 'downloads')
    }

    static getSoftwareDir() {
        return path.join(this.getDir(), 'software')
    }

    static getPhpTypeDir() {
        return path.join(this.getSoftwareDir(), 'php')
    }

    static getServerTypeDir() {
        return path.join(this.getSoftwareDir(), 'server')
    }

    static getToolTypeDir() {
        return path.join(this.getSoftwareDir(), 'tool')
    }

    static getNginxDir() {
        return path.join(this.getServerTypeDir(), 'nginx')
    }

    static getNginxConfDir() {
        return path.join(this.getNginxDir(), 'conf')
    }

    static getNginxVhostsDir() {
        return path.join(this.getNginxConfDir(), 'vhosts')
    }

    static getNginxRewriteDir() {
        return path.join(this.getNginxConfDir(), 'rewrite')
    }

    static getNginxVhostsRewriteDir() {
        return path.join(this.getNginxVhostsDir(), 'rewrite')
    }

    static getNginxVhostsSslDir() {
        return path.join(this.getNginxVhostsDir(), 'ssl')
    }

    static getNginxLogsDir() {
        return path.join(this.getNginxDir(), 'logs')
    }

    static getDatabaseDir() {
        return path.join(this.getDir(), 'database')
    }

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

    static getComposerExePath() {
        return path.join(this.getToolTypeDir(), 'Composer/composer.phar')
    }

    static getMysqlDir(version) {
        return path.join(this.getServerTypeDir(), `mysql-${version}`)
    }

    static getMysqlDataDir(version) {
        return path.join(this.getDatabaseDir(), `mysql-${version}-data`)
    }

    static getWebsiteDir() {
        return path.join(this.getDir(), 'www')
    }
}
