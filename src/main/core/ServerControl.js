import { devConsoleLog } from '@/main/utils/utils'
import ProcessExtend from "@/main/utils/ProcessExtend";
import Software from "@/main/core/software/Software";
import { parseTemplateStrings} from "@/shared/utils/utils";
import child_process from "child_process";
import path from "path";
import FileUtil from "@/main/utils/FileUtil";
import GetDataPath from '@/shared/utils/GetDataPath'

export default class ServerControl {
    /**
     * SoftwareItem
     * @param item {SoftwareItem}
     * @returns {Promise<void>}
     */
    static async start(item) {
        const workPath = Software.getDir(item) //服务目录
        const ctrlProcessPath = this.getControlProcessPath(item)

        if (!await FileUtil.Exists(ctrlProcessPath)) {
            throw new Error(`${ctrlProcessPath} 文件不存在！`)
        }

        let args
        args = Array.isArray(item.StartServerArgs) ? item.StartServerArgs.join(' ') : item.StartServerArgs
        if (args) {
            args = this.parseServerArgs(item, args)
        }

        item.isRunning = true
        item.errMsg = ''
        const command = `${ctrlProcessPath} ${args}`
        const options = { cwd: workPath, shell: true } //使用shell，childProcess返回的pid是shell的pid
        const childProcess = child_process.spawn(command, [], options)

        childProcess.stderr.on('data', (data) => {
            devConsoleLog('stderr data', data?.toString())
            item.errMsg = data?.toString()
        })

        childProcess.on('close', (code) => {
            devConsoleLog(`${path.basename(ctrlProcessPath)},exit code ${code}`)
            item.isRunning = false
        })

        devConsoleLog('ServerControl start command:', command)
        devConsoleLog(`${path.basename(ctrlProcessPath)},pid ${childProcess.pid}`)

        item.pid = childProcess.pid
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
        let args
        args = Array.isArray(item.StopServerArgs) ? item.StopServerArgs.join(' ') : item.StopServerArgs
        if (args) {
            args = this.parseServerArgs(item, args)
            const ctrlProcessPath = this.getControlProcessPath(item)
            const command = `${ctrlProcessPath} ${args}`
            const workPath = Software.getDir(item)
            const options = { cwd: workPath, shell: true }
            child_process.spawn(command, args, options)
        } else {
            await ProcessExtend.kill(item.pid)
        }
    }

    /**
     *
     * @param item{SoftwareItem}
     * @param args{string}
     */
    static parseServerArgs(item, args) {
        const workDir = Software.getDir(item)
        const etcDir = GetDataPath.getEtcDir()

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
            args = parseTemplateStrings(args, varMap)
        }
        return args
    }
}
