import { debugLog, isWindows } from '@/main/utils/utils'
import child_process from 'child_process'
import SettingsExtend from '@/main/services/SettingsExtend'
import util from 'util'
// import { PowerShell } from '@/main/utils/constant'

export default class Shell {
    /**
     * 执行命令，等待进程退出返回结果（标准输出）
     * @param command
     * @param options
     * @returns {Promise<string>}
     */
    static async exec(command, options = {}) {
        debugLog('Shell.exec command', command)

        if (!options.encoding) {
            options.encoding = 'utf8'
        }

        // if (options.shell === PowerShell) {
        //     command = `$OutputEncoding = [console]::InputEncoding = [console]::OutputEncoding = New-Object System.Text.UTF8Encoding;${command}`
        // }

        const exec = util.promisify(child_process.exec)
        const { stdout } = await exec(command, options)
        return stdout
    }

    /**
     * 执行命令，等待进程退出返回结果（标准输出）
     * @param command
     * @param options
     * @returns {Promise<string>}
     */
    static async sudoExec(command, options = {}) {
        if (isWindows) {
            throw new Error(`Cannot be executed on Windows!`)
        }
        debugLog('Shell.sudoExec command', command)

        command = `echo '${SettingsExtend.getUserPwd()}' | sudo -S ${command}`

        if (!options.encoding) {
            options.encoding = 'utf8'
        }

        const exec = util.promisify(child_process.exec)

        const { stdout } = await exec(command, options)
        return stdout
    }
}
