import path from 'path'
import { MAC_DATA_DIR, SETTINGS_FILE_NAME, TEMP_DIR_NAME } from '@/main/helpers/constant'
import { isDev, isMacOS, isWindows } from '@/shared/utils/utils2'
import GetCorePath from '@/shared/helpers/GetCorePath'
import GetAppPath from '@/shared/helpers/GetAppPath'
import { APP_NAME } from '@/shared/helpers/constant'

/**
 * （此程序）数据目录
 */
export default class GetDataPath {
    static getDir() {
        if(isWindows){
            return path.join(GetAppPath.getDir(), `../${APP_NAME}-data`)
        }else if (isMacOS) {
            return MAC_DATA_DIR //dev也是这个目录
        }
        return GetCorePath.getDir()
    }
    static getOldDir() {
        if (isMacOS) {
            return MAC_DATA_DIR //dev也是这个目录
        }
        return GetCorePath.getDir()
    }

    static getSettingsPath() {
        return path.join(GetDataPath.getDir(), SETTINGS_FILE_NAME)
    }

    static getEtcDir = () => path.join(this.getDir(), 'etc') //所有childApp的配置的父目录
    static getOwnEtcDir = (dirName) => path.join(this.getEtcDir(), dirName)

    static getBinDir = () => path.join(this.getDir(), 'bin')

    static geTempDir = () => path.join(this.getDir(), TEMP_DIR_NAME)

    static getDownloadsDir = () => path.join(this.getDir(), 'downloads')

    static getChildAppOldDir = () => path.join(this.getOldDir(), 'childApp') // old
    static getSoftwareOldDir = () => path.join(this.getOldDir(), 'software') // old
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
