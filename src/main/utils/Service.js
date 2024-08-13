import Shell from '@/main/utils/Shell'
import { isWindows } from '@/main/utils/utils'
import { PowerShell } from '@/main/utils/constant'

export default class Service {
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
