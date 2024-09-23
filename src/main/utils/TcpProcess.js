import Shell from '@/main/utils/Shell'
import ProcessExtend from '@/main/utils/ProcessExtend'
import { isMacOS, isWindows } from '@/main/utils/utils'
import { PowerShell } from '@/main/utils/constant'
import { getFileIcon } from '@/shared/utils/file'

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
        let commandStr = `lsof -iTCP -sTCP:LISTEN -P -n|awk 'NR!=1{print $1,$2,$3,$5,$9}'`
        try {
            let resStr = await Shell.sudoExec(commandStr)
            resStr = resStr.trim()
            if (!resStr) {
                return []
            }
            let list = resStr.split('\n')

            return await Promise.all(
                list.map(async (line) => {
                    let lineArr = line.split(' ')
                    let name, pid, user, type, ipAndPort
                    ;[name, pid, user, type, ipAndPort] = lineArr
                    let tempArr = ipAndPort.match(/^(.*):(\d+)$/)
                    let ip, port
                    ;[, ip, port] = tempArr

                    const path = await ProcessExtend.getPathByPid(pid)
                    return { name, pid, user, type, ip, port, path, status: 'Listen' }
                })
            )
        } catch (e) {
            return []
        }
    }

    static async getListForWindowsByShell() {
        let commandStr = ` Get-NetTCPConnection -State Listen|select-Object OwningProcess,LocalAddress,LocalPort`
        commandStr += ', @{n="Name" ;e= {(Get-Process -Id $_.OwningProcess).Name } }  , @{n="Path" ;e= {(Get-Process -Id $_.OwningProcess).Path } }'
        commandStr += ' | fl | Out-String -Width 999'

        try {
            let resStr = await Shell.exec(commandStr, { shell: PowerShell })
            resStr = resStr.trim()
            if (!resStr) {
                return []
            }
            let list = resStr.split(/\r?\n\r?\n/)

            return await Promise.all(
                list.map(async (item) => {
                    let lineArr = item.split(/r?\n/)

                    let arr = lineArr.map((line) => {
                        return line.split(' : ')[1]?.trim()
                    })
                    let pid, ip, port, name, path
                    ;[pid, ip, port, name, path] = arr

                    let icon = path ? await getFileIcon(path) : null
                    return { pid, ip, port, name, path, status: 'Listen', icon }
                })
            )
        } catch (e) {
            return []
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
                const path = await ProcessExtend.getPathByPid(pid)
                const icon = path ? await getFileIcon(path) : null
                result.push({ pid, ip, port, name, path, status: 'Listen', icon })
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
            let pid

            if (isWindows) {
                const net = require('net-win32')
                // pid = await net.getTCPv4PortProcessIDAsync(port)  //Async has promise.all bug
                pid = net.getTCPv4PortProcessID(port)
            } else {
                const commandStr = `lsof -t -sTCP:LISTEN -i:${port}`
                const resStr = await Shell.exec(commandStr)
                if (!resStr) return null
                pid = resStr.trim().split('\n')[0]
            }

            return parseInt(pid)
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
            let path

            if (isWindows) {
                const pid = await TcpProcess.getPidByPort(port)
                path = await ProcessExtend.getPathByPid(pid)
            } else {
                const commandStr = `lsof -t -sTCP:LISTEN -i:${port}|head -n 1|xargs lsof -a -w -d txt -Fn -p|awk 'NR==3{print}'|sed "s/n//"`
                const resStr = await Shell.exec(commandStr)
                if (!resStr) return null
                path = resStr.trim().split('\n')[0]
            }

            return path.trim()
        } catch {
            return null
        }
    }
}
