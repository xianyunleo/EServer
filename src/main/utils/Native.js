import { electronRequire } from '@/main/utils/electron'
import Shell from '@/main/utils/Shell'
import MessageBox from '@/renderer/utils/MessageBox'
import fixPath from 'fix-path'
import GetPath from '@/shared/utils/GetPath'
import FileUtil from '@/main/utils/FileUtil'
import Settings from '@/main/Settings'
import { isMacOS, isWindows } from '@/main/utils/utils'
import FsUtil from '@/main/utils/FsUtil'
import { t } from '@/renderer/utils/i18n'

const shell = electronRequire('shell')

export default class Native {
    /**
     *
     * @param path {string}
     * @returns {Promise<void>}
     */
    static async openApp(path) {
        if (isWindows) {
            Native.openExternal(path)
        } else if (isMacOS) {
            await Shell.exec(`open -a "${path}"`)
        } else {
            throw new Error(`todo`)
        }
    }
    /**
     *
     * @param filePath {string}
     * @returns {Promise<void>}
     */
    static async openTextFile(filePath) {
        if (isMacOS) {
            fixPath() //mac下修复环境变量不识别的问题
        }
        try {
            if (!(await FileUtil.Exists(filePath))) {
                throw new Error(`${filePath} ${t('does not exist!')}`)
            }

            let editorPath = Settings.get('TextEditor')
            //Mac app是目录，Windows app是文件
            if (!(await FsUtil.Exists(editorPath))) {
                throw new Error(`${editorPath} ${t('does not exist!')}\n${t('Please reset the text editor')}`)
            }
            let command
            if (isMacOS) {
                command = `open -a "${editorPath}"  "${filePath}"`
            } else if (isWindows) {
                command = `"${editorPath}" "${filePath}"`
            }
            await Shell.exec(command)
        } catch (error) {
            //todo渲染进程捕捉错误
            MessageBox.error(error.message ?? error, t('Error opening file!'))
        }
    }

    static async openPath(path) {
        return await shell.openPath(path)
    }

    static async showItemInFolder(path) {
        await shell.showItemInFolder(path)
    }

    static async openExternal(path) {
        return await shell.openExternal(path)
    }

    static async openDirectory(path) {
        if (isWindows) {
            return await shell.openExternal(path)
        }
        return await shell.openPath(path)
    }

    static async openUrl(url) {
        return await shell.openExternal(url)
    }

    static async openHosts() {
        let path = GetPath.getHostsPath()
        if ((await FileUtil.Exists(path)) && !(await FsUtil.CanReadWrite(path))) {
            await FsUtil.ChmodReadWrite(path)
        }
        await Native.openTextFile(path)
    }
}
