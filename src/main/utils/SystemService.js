import Shell from '@/main/utils/Shell'
import { isWindows } from '@/main/utils/utils'
import { PowerShell } from '@/main/utils/constant'
import nodePath from 'path'

export default class SystemService {
    static async isRunning(name) {
        try {
            let res, commandStr;

            if (isWindows) {
                commandStr = `Get-Service ${name} |Where-Object {$_.Status -eq "Running"}`;
                res = await Shell.exec(commandStr, { shell: PowerShell })
                return !!res;
                // eslint-disable-next-line no-empty
            } else {

            }
        } catch {
            return false;
        }
    }

    /**
     *
     * @param name {string}
     * @param pathWithArgs {string}
     * @returns {Promise<void>}
     */
    static async create(name, pathWithArgs) {
        try {
            pathWithArgs = nodePath.normalize(pathWithArgs)
            let commandStr

            if (isWindows) {
                commandStr = `sc create ${name} binPath="${pathWithArgs}" start=auto`
                await Shell.exec(commandStr)
                // eslint-disable-next-line no-empty
            } else {

            }
            // eslint-disable-next-line no-empty
        } catch {

        }
    }

    static async delete(name) {
        try {
            let commandStr

            if (isWindows) {
                commandStr = `sc delete ${name}`
                await Shell.exec(commandStr)
                // eslint-disable-next-line no-empty
            } else {
            }
            // eslint-disable-next-line no-empty
        } catch {

        }
    }

    /**
     * 判断service是否存在
     * @param name
     * @returns {Promise<boolean>}
     */
    static async exists(name) {
        try {
            let commandStr

            if (isWindows) {
                commandStr = `sc query ${name}` //sc query查询不存在的服务会报错
                await Shell.exec(commandStr)
                return true
                // eslint-disable-next-line no-empty
            } else {
            }
            // eslint-disable-next-line no-empty
        } catch (e){
            return false
        }
    }

    static async stop(name) {
        try {
            let commandStr;

            if (isWindows) {
                commandStr = `Stop-Service ${name}`;
                await Shell.exec(commandStr, { shell: PowerShell })
                // eslint-disable-next-line no-empty
            } else {

            }
            // eslint-disable-next-line no-empty
        } catch {

        }
    }
}
