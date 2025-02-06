import { devConsoleLog } from '@/main/utils/utils'
import ProcessExtend from "@/main/utils/ProcessExtend";
import Software from "@/main/core/software/Software";
import { parseTemplateStrings} from "@/shared/utils/utils";
import child_process from "child_process";
import path from "path";
import FileUtil from "@/main/utils/FileUtil";

export default class ServerControl {
    /**
     * SoftwareItem
     * @param item {SoftwareItem}
     * @returns {Promise<void>}
     */
    static async start(item) {
        const workPath = Software.getPath(item) //服务目录
        const ctrlProcessPath = this.getControlProcessPath(item)
        const options = { cwd: workPath, detached: true }

        if (item.ShellServerProcess) {
            options.detached = false
            options.shell = true //使用shell，childProcess返回的pid是shell的pid
        }

        if (!await FileUtil.Exists(ctrlProcessPath)) {
            throw new Error(`${ctrlProcessPath} 文件不存在！`);
        }

        let args = []
        if (item.StartServerArgs) {
            args = this.parseServerArgs(item, item.StartServerArgs)
        }

        item.isRunning = true
        item.errMsg = ''

        const childProcess = child_process.spawn(ctrlProcessPath, args, options);

        childProcess.stderr.on('data', (data) => {
            devConsoleLog('stderr data', data?.toString())
            item.errMsg = data?.toString()
        })

        childProcess.on('close', (code) => {
            devConsoleLog(`${path.basename(ctrlProcessPath)},exit code ${code}`)
            item.isRunning = false
        })

        devConsoleLog('ServerControl start command:', `${ctrlProcessPath} ${args.join(' ')}`)
        devConsoleLog(`${path.basename(ctrlProcessPath)},pid ${childProcess.pid}`)

        item.pid = childProcess.pid;
    }

    static getControlProcessPath(item) {
        const workPath = Software.getPath(item)
        if (item.ControlProcessPath) {
            return path.join(workPath, item.ControlProcessPath) //控制进程的目录
        } else {
            return path.join(workPath, item.ServerProcessPath) //服务进程的目录
        }
    }

    /**
     *
     * @param item{SoftwareItem}
     * @returns {Promise<void>}
     */
    static async stop(item) {
        const workPath = Software.getPath(item)
        const options = { cwd: workPath, detached: true }
        if (item.StopServerArgs) {
            const args = this.parseServerArgs(item, item.StopServerArgs)
            if (item.ShellServerProcess) {
                options.detached = false
                options.shell = true //使用shell，childProcess返回的pid是shell的pid
            }
            const ctrlProcessPath = this.getControlProcessPath(item)
            child_process.spawn(ctrlProcessPath, args, options)
        } else {
            await ProcessExtend.kill(item.pid)
        }
    }

    /**
     *
     * @param item{SoftwareItem}
     * @param args{array}
     */
    static parseServerArgs(item, args) {
        const workPath = Software.getPath(item)
        return args.map((arg) => {
            const argObj = {
                WorkPath: workPath.replaceSlash(),
                ServerProcessPath: path.join(workPath, item.ServerProcessPath).replaceSlash(),
                ConfPath: item.ConfPath ? path.join(workPath, item.ConfPath).replaceSlash() : null,
                ServerConfPath: item.ServerConfPath ? path.join(workPath, item.ServerConfPath).replaceSlash() : null,
                ExtraProcessPath: item.ExtraProcessPath ? path.join(workPath, item.ExtraProcessPath).replaceSlash() : null
            }
            return parseTemplateStrings(arg, argObj)
        })
    }
}
