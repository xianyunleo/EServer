import { isDev, isMacOS, isWindows } from '@/main/utils/utils'
import path from 'path'
import ChildApp from '@/main/services/childApp/ChildApp'
import { INIT_FILE_NAME, CoreDirNames } from '@/main/utils/constant'
import GetPath from '@/shared/utils/GetPath'
import process from 'process'

export default class GetCorePath {
    static getDir() {
        const coreDirName = CoreDirNames[process.platform]
        if (isDev) {
            return path.join(GetPath.getDevPlatformDir(), coreDirName)
        } else {
            if (isWindows) {
                return path.join(GetPath.getDir(), coreDirName)
            } else if (isMacOS) {
                return path.join(GetPath.getContentsDir(), coreDirName)
            }
        }
    }

    static getInitFilePath() {
        return path.join(this.getDir(), INIT_FILE_NAME)
    }
    static getScriptDir() {
        return path.join(this.getDir(), 'script')
    }

    static getMysqlIconPath() {
        return 'file://' + path.join(ChildApp.getIconPath(), 'mysql.png')
    }
}
