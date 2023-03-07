import OS from "@/main/core/OS";
import Command from "@/main/core/Command";

export default class Service {
    static async isRunning(name) {
        try {
            let res, commandStr;

            if (OS.isWindows()) {
                commandStr = `Get-Service ${name} |Where-Object {$_.Status -eq "Running"}`;
                res = await Command.exec(commandStr, {shell: 'powershell'});
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

            if (OS.isWindows()) {
                commandStr = `Stop-Service ${name}`;
                await Command.exec(commandStr, {shell: 'powershell'});
                // eslint-disable-next-line no-empty
            } else {

            }
            // eslint-disable-next-line no-empty
        } catch {

        }
    }
}
