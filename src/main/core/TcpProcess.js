import Command from "@/main/core/Command";
import OS from "@/main/core/OS";
import ProcessExtend from "@/main/core/ProcessExtend";

export default class TcpProcess {

    /**
     *
     * @param port
     * @returns {Promise<number|null>}
     */
    static async getPidByPort(port) {
        try {
            let pid, commandStr;

            if (OS.isWindows()) {
                commandStr = `PowerShell -Command "& {(Get-NetTCPConnection -LocalPort ${port} -State Listen).OwningProcess}"`;
                pid = await Command.exec(commandStr);
                if (!pid) {
                    return null;
                }
            } else {
                commandStr = `lsof -t -sTCP:LISTEN -i:${port}`;
                let str = await Command.exec(commandStr);
                if (!str) {
                    return null;
                }
                pid = str.trim().split("\n")[0];
            }
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
            let path, commandStr;

            if (OS.isWindows()) {
                commandStr = `PowerShell -Command "& {(Get-Process -Id (Get-NetTCPConnection -LocalPort ${port} -State Listen).OwningProcess).path}"`;
                path = await Command.exec(commandStr);
                if (!path) {
                    return null;
                }
            } else {
                commandStr = `lsof -a -d txt -p ${port}|awk '{print $9}'`;
                let str = await Command.exec(commandStr);
                if (!str) {
                    return null;
                }
                path = str.trim().split("\n")[1];
            }
            return path.trim();
        } catch {
            return null;
        }
    }


    static async killByPort(port) {
        let pid = await TcpProcess.getPidByPort(port);
        if(pid){
            await ProcessExtend.kill(pid);
        }
    }
}
