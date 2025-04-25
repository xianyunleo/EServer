import path from 'path'
import { MAC_DATA_DIR, TEMP_DIR_NAME } from '@/main/utils/constant'
import { isDev, isMacOS, isWindows } from '@/main/utils/utils'
import GetCorePath from '@/shared/utils/GetCorePath'

/**
 * （此程序）数据目录
 */
export default class GetDataPath {
    static getDir() {
        if (isMacOS) {
            return MAC_DATA_DIR //dev也是这个目录
        }
        return GetCorePath.getDir()
    }

    static getEtcDir = () => path.join(this.getDir(), 'etc') //所有childApp的配置的父目录
    static getOwnEtcDir = (dirName) => path.join(this.getEtcDir(), dirName)

    static getBinDir = () => path.join(this.getDir(), 'bin')

    static geTempDir = () => path.join(this.getDir(), TEMP_DIR_NAME)

    static getDownloadsDir = () => path.join(this.getDir(), 'downloads')

    static getSoftwareDir = () => path.join(this.getDir(), 'software') // old
    static getChildAppDir = () => path.join(this.getDir(), 'childApp')

    static getPhpTypeDir = () => path.join(this.getChildAppDir(), 'php')

    static getServerTypeDir = () => path.join(this.getChildAppDir(), 'server')

    static getToolTypeDir = () => path.join(this.getChildAppDir(), 'tool')

    static getNginxDir = () => path.join(this.getServerTypeDir(), 'nginx')

    static getEtcNginxDir = () => path.join(this.getEtcDir(), 'nginx')

    static getNginxConfDir = () => path.join(this.getEtcNginxDir(), 'conf')
    static getNginxPhpConfDir = () => path.join(this.getNginxConfDir(), 'php')

    static getNginxVhostsDir = () => path.join(this.getNginxConfDir(), 'vhosts')

    static getNginxRewriteDir = () => path.join(this.getNginxConfDir(), 'rewrite')

    static getNginxVhostsRewriteDir = () => path.join(this.getNginxVhostsDir(), 'rewrite')

    static getNginxVhostsSslDir = (dir = '') => path.join(this.getNginxVhostsDir(), 'ssl', dir)

    static getNginxLogsDir = () => path.join(this.getNginxDir(), 'logs')

    static getDatabaseDir = () => path.join(this.getDir(), 'database')

    static getPhpDir = (version) => path.join(this.getPhpTypeDir(), `php-${version}`)

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
