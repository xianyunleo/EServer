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

    static async create(name, path) {
        try {
            path = nodePath.normalize(path)
            let commandStr

            if (isWindows) {
                commandStr = `sc create ${name} binPath=${path}`
                await Shell.exec(commandStr)
                // eslint-disable-next-line no-empty
            } else {

            }
            // eslint-disable-next-line no-empty
        } catch {

        }
    }

    static async exists(name) {
        try {
            let commandStr

            if (isWindows) {
                commandStr = `sc query ${name}`
                await Shell.exec(commandStr)
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
