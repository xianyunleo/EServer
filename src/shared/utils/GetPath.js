import { isDev, isMacOS, isWindows } from '@/main/utils/utils'
import path from 'path'
import Software from '@/main/core/software/Software'
import { MAC_USER_CORE_DIR, TEMP_DIR_NAME } from '@/main/utils/constant'
import Settings from '@/main/Settings'
import GetAppPath from '@/main/utils/GetAppPath'

export default class GetPath {
    static getBinDir() {
        return path.join(GetAppPath.getUserCoreDir(), 'bin')
    }

    static geTempDir() {
        return path.join(GetAppPath.getUserCoreDir(), TEMP_DIR_NAME)
    }

    static getDownloadsDir() {
        return path.join(GetAppPath.getUserCoreDir(), 'downloads')
    }

    static getSoftwareDir() {
        return path.join(GetAppPath.getUserCoreDir(), 'software')
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

    static getDatabaseDir() {
        return path.join(GetAppPath.getUserCoreDir(), 'database')
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
        const websiteDir = Settings.get('WebsiteDir')
        if (websiteDir) {
            return websiteDir
        }
        return path.join(GetAppPath.getUserCoreDir(), 'www')
    }

    static getScriptDir() {
        return path.join(GetAppPath.getCoreDir(), 'script')
    }

    static getMysqlIconPath() {
        return 'file://' + path.join(Software.getIconPath(), 'mysql.png')
    }

    static getHostsPath() {
        if (isWindows) {
            return 'C:\\Windows\\System32\\drivers\\etc\\hosts'
        } else {
            return '/etc/hosts'
        }
    }
}
