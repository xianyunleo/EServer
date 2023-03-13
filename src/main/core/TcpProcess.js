import Command from "@/main/core/Command";
import OS from "@/main/core/OS";

export default class TcpProcess {

    /**
     *
     * @param port
     * @returns {Promise<number|null>}
     */
    static async getPidByPort(port) {
        try {
            let commandStr, resStr, pid;

            if (OS.isWindows()) {
                commandStr = `PowerShell -Command "& {(Get-NetTCPConnection -LocalPort ${port} -State Listen).OwningProcess}"`;
            } else {
                commandStr = `lsof -t -sTCP:LISTEN -i:${port}`;
            }

            resStr = await Command.exec(commandStr);
            if (!resStr) {
                return null;
            }
            pid = resStr.trim().split("\n")[0];
            return parseInt(pid);
        } catch {
            return null;
        }
    }

    /**
     * @param port
     * @returns {Promise<null|string>}
     */
    static async getPathByPort(port) {
        try {
            let commandStr, resStr, path;

            if (OS.isWindows()) {
                commandStr = `PowerShell -Command "& {(Get-Process -Id (Get-NetTCPConnection -LocalPort ${port} -State Listen).OwningProcess).path}"`;
            } else {
                commandStr = `lsof -t -sTCP:LISTEN -i:${port}|head -1|xargs lsof -a -w  -d txt -p|grep -v .dylib|awk 'NR!=1{print $9}'`;
            }

            resStr = await Command.exec(commandStr);
            if (!resStr) {
                return null;
            }
            path = resStr.trim().split("\n")[0];
            return path.trim();
        } catch {
            return null;
        }
    }
}
