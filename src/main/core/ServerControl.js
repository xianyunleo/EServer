import { devConsoleLog } from '@/main/utils/utils'
import ProcessExtend from "@/main/utils/ProcessExtend";
import Software from "@/main/core/software/Software";
import { parseTemplateStrings} from "@/shared/utils/utils";
import child_process from "child_process";
import path from "path";
import FileUtil from "@/main/utils/FileUtil";
import GetUserPath from '@/shared/utils/GetUserPath'

export default class ServerControl {
    /**
     * SoftwareItem
     * @param item {SoftwareItem}
     * @returns {Promise<void>}
     */
    static async start(item) {
        const workPath = Software.getDir(item) //服务目录
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
        const workPath = Software.getDir(item)
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
        const workPath = Software.getDir(item)
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
        const workDir = Software.getDir(item)
        const etcDir = GetUserPath.getEtcDir()
        return args.map((varStr) => {
            //将所有平台的路径分隔符改成正斜杠 /
            const varMap = {
                WorkDir: workDir.replaceSlash(),
                WorkPath: workDir.replaceSlash(),
                EtcDir: path.join(etcDir, item.DirName).replaceSlash(),
                ServerProcessPath: path.join(workDir, item.ServerProcessPath).replaceSlash(),
                ConfPath: item.ConfPath ? item.ConfPath.replaceSlash() : null,
                ServerConfPath: item.ServerConfPath ? item.ServerConfPath.replaceSlash() : null,
                ExtraProcessPath: item.ExtraProcessPath ? path.join(workDir, item.ExtraProcessPath).replaceSlash() : null
            }
            for (let i = 0; i < 3; i++) { //最多解析嵌套的层数为3层
                varStr = parseTemplateStrings(varStr, varMap)
            }
            return varStr
        })
    }
}
