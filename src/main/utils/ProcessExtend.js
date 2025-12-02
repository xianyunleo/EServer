import Command from '@/main/utils/Command'
import { isMacOS, isWindows } from '@/shared/utils/utils2'
import { PowerShell, WINDOWS_API_FILE_NAME } from '@/main/helpers/constant'
import nodePath from 'path'
import GetCorePath from '@/shared/helpers/GetCorePath'

export default class ProcessExtend {
    static _ffiModule = null;
    static _initFfi(){
        if(!ProcessExtend._ffiModule){
            ProcessExtend._ffiModule = require('koffi')
            ProcessExtend._ffiModule.config({max_async_calls:256})
        }
        return ProcessExtend._ffiModule
    }
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
                await Command.exec(`taskkill /f /t /pid ${pid}`)
            } else {
                await Command.sudoExec(`kill ${pid}`)
            }
            // eslint-disable-next-line no-empty
        } catch {}
    }

    static async getParentPid(pid) {
        try {
            if (isWindows) {
                const hmc = require('hmc-win32')
                return hmc.getProcessParentProcessID(pid)
            } else {
                const commandStr = `ps -o ppid= -p ${pid}`
                const resStr = await Command.exec(commandStr)
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
                await Command.exec(`taskkill /f /t /im ${name}.exe`)
            } else {
                //pkill杀不存在的进程会有标准错误，从而引发异常
                await Command.sudoExec(`pkill ${name}`)
            }
            // eslint-disable-next-line no-empty
        } catch {}
    }

    static pidIsRunning(pid) {
        try {
            process.kill(pid, 0)
            return true
        } catch (e) {
            return false
        }
    }

    /**
     * 根据pid，获取进程路径
     * @param pid {number}
     * @returns {Promise<*|null>}
     */
    static async getPathByPid(pid) {
        try {
            pid = parseInt(pid)
            let path

            if (isWindows) {
                path = await ProcessExtend.getPathByPidForWindows(pid)
            } else {
                const commandStr = `lsof -p ${pid} -a -w -d txt -Fn|awk 'NR==3{print}'|sed "s/n//"`
                const resStr = await Command.exec(commandStr)
                path = resStr.trim().split('\n')[0]
            }

            return path.trim()
        } catch {
            return null
        }
    }

    static async getNameByPidForWindows(pid) {
        try {
            const koffi = ProcessExtend._initFfi()
            const libPath = nodePath.join(GetCorePath.getParentDir(), WINDOWS_API_FILE_NAME)
            const lib = koffi.load(libPath)
            const getProcessName = lib.func('getProcessName', 'str', ['int'])
            // 个别进程的  getProcessName 比  getProcessPath 更耗时
            return await new Promise((resolve, reject) => {
                getProcessName.async(pid, (err, res) => {
                    resolve(res ?? '')
                })
            })
        }catch(e){
            return null
        }
    }

    static async getPathByPidForWindows(pid) {
        try {
            const koffi = ProcessExtend._initFfi()
            const libPath = nodePath.join(GetCorePath.getParentDir(), WINDOWS_API_FILE_NAME)
            const lib = koffi.load(libPath)
            const getProcessPath = lib.func('getProcessPath', 'str', ['int'])
            return getProcessPath(pid)
        }catch{
            return null
        }
    }

    /**
     *
     * @param options {object}
     * @returns {Promise<[]|{path: *, name: *, pid: *, ppid: *}[]>}
     */
    static async getList(options = {}) {
        if (isMacOS) {
            return await this.getListForMacOS(options)
        } else if (isWindows) {
            return await this.getListForWindows(options)
        }
        return []
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
            let str = await Command.sudoExec(command)
            str = str.trim()
            if (!str) {
                return []
            }
            let list = str.split('\n')

            list = list.map((item) => {
                let arr = item.split(' ')
                const [name, pid, ppid, path] = arr
                return { name, pid, ppid, path }
            })

            return list
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
            let str = await Command.exec(command, { shell: PowerShell })
            str = str.trim()
            if (!str) {
                return []
            }
            let list = str.split(/\r?\n\r?\n/)
            list = list.map((item) => {
                let lineArr = item.split(/\r?\n/)

                let arr = lineArr.map((line) => {
                    return line.split(' : ')[1]?.trim()
                })

                const [name, pid, ppid, path] = arr
                return { name, pid, ppid, path }
            })
            return list
        } catch (e) {
            return []
        }
    }
}
