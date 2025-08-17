import { isDev, isMacOS, isWindows } from '@/shared/utils/utils2'
import path from 'path'
import ChildApp from '@/main/services/childApp/ChildApp'
import { INIT_FILE_NAME, CoreDirNames, INSTALL_OR_UPDATE_FILE_NAME } from '@/main/helpers/constant'
import GetAppPath from '@/shared/helpers/GetAppPath'
import process from 'process'

export default class GetCorePath {
    static getDir() {
        const coreDirName = CoreDirNames[process.platform]
        if (isDev) {
            return path.join(GetAppPath.getDevPlatformDir(), coreDirName)
        } else {
            if (isWindows) {
                return path.join(GetAppPath.getDir(), coreDirName)
            } else if (isMacOS) {
                return path.join(GetAppPath.getContentsDir(), coreDirName)
            }
        }
    }

    //用来第一次安装或者覆盖安装更新
    static getInstallOrUpdateFilePath() {
        return path.join(this.getDir(), INSTALL_OR_UPDATE_FILE_NAME)
    }

    static getScriptDir() {
        return path.join(this.getDir(), 'script')
    }

    static getMysqlIconPath() {
        return 'file://' + path.join(ChildApp.getIconPath(), 'mysql.png')
    }
}
