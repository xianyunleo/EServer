import Shell from '@/main/utils/Shell'
import { isMacOS, isWindows } from '@/main/utils/utils'
import { PowerShell } from '@/main/helpers/constant'
import OS from '@/main/utils/OS'

export default class ProcessExtend {
    /**
     *  杀死进程和子进程
     * @param pid {number}
     * @param killParent {boolean} 判断父进程是否同路径。如果是，那么杀死父进程
     * @returns {Promise<*>}
     */
    static async kill(pid, killParent = false) {
        try {
            if (killParent) {
                const ppid = await ProcessExtend.getParentPid(pid)
                if (ppid) {
                    const p1 = await ProcessExtend.getPathByPid(pid, true)
                    const p2 = await ProcessExtend.getPathByPid(ppid, true)
                    pid = p2 === p1 && !!p1 ? ppid : pid
                }
            }
            if (isWindows) {
                //taskkill杀不存在的进程会有标准错误，从而引发异常
                await Shell.exec(`taskkill /f /t /pid ${pid}`);
            } else {
                await Shell.sudoExec(`kill ${pid}`);
            }
            // eslint-disable-next-line no-empty
        } catch {

        }
    }

    static async getParentPid(pid) {
        try {
            if (isWindows) {
                const hmc = require('hmc-win32')
                return hmc.getProcessParentProcessID(pid)
            } else {
                const commandStr = `ps -o ppid= -p ${pid}`
                const resStr = await Shell.exec(commandStr)
                let ppid = resStr.trim().split('\n')[0]
                return ppid ? ppid : null
            }
        } catch {
            return null
        }
    }

    /**
     * 杀死进程和子进程
     * @param name {string}
     * @returns {Promise<*>}
     */
    static async killByName(name) {
        try {
            if (isWindows) {
                //taskkill杀不存在的进程会有标准错误，从而引发异常
                await Shell.exec(`taskkill /f /t /im ${name}.exe`);
            } else {
                //pkill杀不存在的进程会有标准错误，从而引发异常
                await Shell.sudoExec(`pkill ${name}`);
            }
            // eslint-disable-next-line no-empty
        } catch {

        }
    }

    static pidIsRunning(pid) {
        try {
            process.kill(pid, 0);
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * 根据pid，获取进程路径。Windows下，winShell=false，不支持并发，但是速度快。winShell=true，支持并发，但是速度慢。
     * @param pid {number}
     * @param winShell {boolean}
     * @returns {Promise<*|null>}
     */
    static async getPathByPid(pid, winShell = false) {
        try {
            pid = parseInt(pid)
            let path

            if (isWindows) {
                if (winShell) {
                    const versionStr = OS.getVersion()
                    const [major, minor, build] = versionStr.split('.').map(Number)
                    if (major === 10 && build >= 22000) {
                        //Windows 11: 版本号从 10.0.22000 开始。Windows11 废弃了 wmic
                        const commandStr = `(Get-Process -Id ${pid}).MainModule.FileName`
                        const resStr = await Shell.exec(commandStr, { shell: PowerShell })
                        path = resStr.trim().split('\n')[0]
                    } else {
                        const commandStr = `wmic process where processid=${pid} get executablepath`
                        const resStr = await Shell.exec(commandStr)
                        path = resStr.trim().split('\n')[1]
                    }
                } else {
                    const hmc = require('hmc-win32')
                    path = await hmc.getProcessFilePath2(pid) //getProcessFilePath2暂不支持并发
                    path = path ?? ''
                    path = path.startsWith('\\Device\\HarddiskVolume') ? '' : path //过滤掉 getProcessFilePath2 错误的path
                }
            } else {
                const commandStr = `lsof -p ${pid} -a -w -d txt -Fn|awk 'NR==3{print}'|sed "s/n//"`
                const resStr = await Shell.exec(commandStr)
                path = resStr.trim().split('\n')[0]
            }

            return path.trim()
        } catch {
            return null
        }
    }

    /**
     *
     * @param options {object}
     * @returns {Promise<[]|{path: *, name: *, pid: *, ppid: *}[]>}
     */
    static async getList(options={}) {
        if (isMacOS) {
            return await this.getListForMacOS(options);
        } else if (isWindows) {
            return await this.getListForWindows(options);
        }
        return [];
    }

    static async getListForMacOS(options = {}) {
        let command = 'lsof -w -R -d txt'
        if (options) {
            command += `|grep -F` //这里不能使用lsof的+D参数，会有exit code，且性能不好
            if (options.directory) {
                command += ` -e '${options.directory}'`
            }
            if (options.pathList) {
                for (const p of options.pathList) {
                    command += ` -e '${p}'`
                }
            }
        }
        command += `|grep -F -v '.dylib'|awk '{print $1,$2,$3,$10}'`
        try {
            let str = await Shell.sudoExec(command)
            str = str.trim();
            if(!str){
                return [];
            }
            let list = str.split('\n');

            list = list.map(item => {
                let arr = item.split(' ');
                let name, pid, ppid, path;
                [name, pid, ppid, path] = arr;
                return {name, pid, ppid, path};
            });

            return list;
        } catch (e) {
            return []
        }

    }

    static async getListForWindows(options = {}) {
        let command = ' Get-WmiObject -Class Win32_Process -Filter '
        if (options) {
            if (options.directory) {
                let formatDir = options.directory.replaceAll('\\', '\\\\')
                //这里只能是ExecutablePath不能是Path，因为Path是PowerShell的'ScriptProperty'
                command += `"ExecutablePath like '${formatDir}%'"`
            }
        }
        command += ' |Select-Object Name,ProcessId,ParentProcessId,ExecutablePath | Format-List | Out-String -Width 999'

        try {
            let str = await Shell.exec(command, { shell: PowerShell })
            str = str.trim()
            if (!str) {
                return []
            }
            let list = str.split(/\r?\n\r?\n/)
            list = list.map(item => {
                let lineArr = item.split(/\r?\n/)

                let arr = lineArr.map(line => {
                    return line.split(' : ')[1]?.trim()
                })

                let name, pid, ppid, path;
                [name, pid, ppid, path] = arr
                return { name, pid, ppid, path }
            })
            return list
        } catch (e) {
            return []
        }
    }
}
