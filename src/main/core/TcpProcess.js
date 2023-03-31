import Command from "@/main/core/Command";
import OS from "@/main/core/OS";
import ProcessExtend from "@/main/core/ProcessExtend";


export default class TcpProcess {

    static async getList() {
        if (OS.isMacOS()) {
            return await this.getListByMacOS();
        } else if (OS.isWindows()) {
            return await this.getListByWindows();
        }
        return [];
    }

    static async getListByMacOS() {
        let commandStr = `lsof -iTCP -sTCP:LISTEN -P -n|awk 'NR!=1{print $1,$2,$3,$5,$9}'`;
        try {
            let resStr = await Command.sudoExec(commandStr);
            resStr = resStr.trim();
            if (!resStr) {
                return [];
            }
            let list = resStr.split('\n');

            return await Promise.all(
                list.map(async line => {
                    let lineArr = line.split(' ');
                    let name, pid, user, type, ipAndPort;
                    [name, pid, user, type, ipAndPort] = lineArr;
                    let tempArr = ipAndPort.split(/[:\s]/);
                    let ip, port;
                    [ip, port] = tempArr;

                    let path = await ProcessExtend.getPathByPid();
                    return {name, pid, user, type, ip, port, path, status: 'Listen'};
                })
            );
        } catch (e) {
            return [];
        }
    }

    static async getListByWindows() {
        let commandStr = ` Get-NetTCPConnection -State Listen|select-Object OwningProcess,LocalAddress,LocalPort`;
        commandStr += ', @{n="Name" ;e= {(Get-Process -Id $_.OwningProcess).Name } }  , @{n="Path" ;e= {(Get-Process -Id $_.OwningProcess).Path } }';
        commandStr += ' | fl | Out-String -Width 999';

        try {
            let resStr = await Command.exec(commandStr, {shell: 'powershell'});
            resStr = resStr.trim();
            if (!resStr) {
                return [];
            }
            let list = resStr.split(/\r?\n\r?\n/);
            list = list.map(item => {
                let lineArr = item.split(/r?\n/);
                let arr = lineArr.map(line => {

                    return line.split(' : ')[1].trim();
                });

                let name, pid, path, ip, port;
                [pid, ip, port, name, path] = arr;
                return {name, pid, ip, port, path, status: 'Listen'};
            });
            return list;
        } catch (e) {
            return [];
        }
    }


    /**
     *
     * @param port
     * @returns {Promise<number|null>}
     */
    static async getPidByPort(port) {
        try {
            let commandStr, resStr, pid;

            if (OS.isWindows()) {
                commandStr = `(Get-NetTCPConnection -LocalPort ${port} -State Listen).OwningProcess"`;
                resStr = await Command.exec(commandStr, {shell: 'powershell'});
            } else {
                commandStr = `lsof -t -sTCP:LISTEN -i:${port}`;
                resStr = await Command.exec(commandStr);
            }

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
                commandStr = `(Get-Process -Id (Get-NetTCPConnection -LocalPort ${port} -State Listen).OwningProcess).Path"`;
                resStr = await Command.exec(commandStr, {shell: 'powershell'});
            } else {
                commandStr = `lsof -t -sTCP:LISTEN -i:${port}|head -n 1|xargs lsof -a -w -d txt -p|grep -v .dylib|awk 'NR!=1{print $9}'`;
                resStr = await Command.exec(commandStr);
            }

            if (!resStr) {
                return null;
            }
            path = resStr.trim().split("\n")[0];
            return path.trim();
        } catch {
            return null;
        }
    }


    static async killByPort(port) {
        let pid = await TcpProcess.getPidByPort(port);
        if (pid) {
            await ProcessExtend.kill(pid);
        }
    }
}
