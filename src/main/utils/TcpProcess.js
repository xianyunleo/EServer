import { electronRequire } from '@/main/utils/electron'
import Shell from '@/main/utils/Shell'
import ProcessExtend from '@/main/utils/ProcessExtend'
import { isMacOS, isWindows } from '@/main/utils/utils'

const app = electronRequire('app')

export default class TcpProcess {

    static async getList() {
        if (isMacOS) {
            return await this.getListForMacOS()
        } else if (isWindows) {
            return await this.getListForWindows()
        }
        return []
    }

    static async getListForMacOS() {
        let commandStr = `lsof -iTCP -sTCP:LISTEN -P -n|awk 'NR!=1{print $1,$2,$3,$5,$9}'`;
        try {
            let resStr = await Shell.sudoExec(commandStr);
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
                    let tempArr = ipAndPort.match(/^(.*):(\d+)$/);
                    let ip, port;
                    [,ip, port] = tempArr;

                    let path = await ProcessExtend.getPathByPid(pid);
                    return {name, pid, user, type, ip, port, path, status: 'Listen'};
                })
            );
        } catch (e) {
            return [];
        }
    }

    static async getListForWindowsByShell() {
        let commandStr = ` Get-NetTCPConnection -State Listen|select-Object OwningProcess,LocalAddress,LocalPort`;
        commandStr += ', @{n="Name" ;e= {(Get-Process -Id $_.OwningProcess).Name } }  , @{n="Path" ;e= {(Get-Process -Id $_.OwningProcess).Path } }';
        commandStr += ' | fl | Out-String -Width 999';

        try {
            let resStr = await Shell.exec(commandStr, {shell: 'powershell'});
            resStr = resStr.trim();
            if (!resStr) {
                return [];
            }
            let list = resStr.split(/\r?\n\r?\n/);

            return await Promise.all(
                list.map(async item => {
                    let lineArr = item.split(/r?\n/);

                    let arr = lineArr.map(line => {
                        return line.split(' : ')[1]?.trim()
                    });
                    let pid, ip, port, name, path;
                    [pid, ip, port, name, path] = arr;

                    let icon = path ? (await app.getFileIcon(path))?.toDataURL() : null;
                    return {pid, ip, port, name, path, status: 'Listen', icon};
                })
            );
        } catch (e) {
            return [];
        }
    }

    static async getListForWindows() {
        const net = require('net-win32')
        const hmc = require('hmc-win32')
        try {
            let list = await net.getConnectNetListAsync(true, false, true, false)
            list = await list.filterAsync((item) => item.state === 'LISTEN')
            //由于hmc的promise暂不支持并发，所以先用for of
            const result = []
            for (const item of list) {
                const { pid, ip, port } = item
                const name = await hmc.getProcessName2(pid)
                const path = await hmc.getProcessFilePath2(pid)
                result.push({ pid, ip, port, name, path })
            }

            return result
        } catch (e) {
            return []
        }
    }

    /**
     *
     * @param port {number}
     * @returns {Promise<number|null>}
     */
    static async getPidByPort(port) {
        try {
            port = parseInt(port)
            const net = require('net-win32')
            return await net.getTCPv4PortProcessIDAsync(port)
        } catch {
            return null
        }
    }

    /**
     * @param port {number}
     * @returns {Promise<null|string>}
     */
    static async getPathByPort(port) {
        try {
            port = parseInt(port)
            const pid = TcpProcess.getPidByPort(port)
            const hmc = require('hmc-win32')
            return await hmc.getProcessFilePath2(pid)
        } catch {
            return null
        }
    }
}
