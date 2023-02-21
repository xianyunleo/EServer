import Command from "@/main/core/Command";

export default class TcpProcess {

    /**
     *
     * @param port
     * @returns {Promise<number|null>}
     */
    static async getPidByPort(port) {
        try {
            let commandStr = `PowerShell -Command "& {(Get-NetTCPConnection -LocalPort ${port} -State Listen).OwningProcess)}"`;
            let pid = await Command.exec(commandStr);
            return parseInt(pid.trim());
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
            let commandStr = `PowerShell -Command "& {(Get-Process -Id (Get-NetTCPConnection -LocalPort ${port} -State Listen).OwningProcess).path}"`;
            let path = await Command.exec(commandStr);
            return path.trim();
        } catch {
            return null;
        }
    }
}
