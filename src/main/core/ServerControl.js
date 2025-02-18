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
        const workDir = Software.getDir(item) //服务目录

        const itemMap = this.parseServerFields(item)
        const ctrlProcessPath = this.getControlProcessPath(itemMap)

        if (!await FileUtil.Exists(ctrlProcessPath)) {
            throw new Error(`${ctrlProcessPath} 文件不存在！`)
        }
        item.isRunning = true
        item.errMsg = ''
        const command = `${ctrlProcessPath} ${itemMap.StartServerArgs}`
        const options = { cwd: workDir, shell: true } //使用shell，childProcess返回的pid是shell的pid
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

    /**
     *
     * @param item{SoftwareItem}
     * @returns {Promise<void>}
     */
    static async stop(item) {
        if (item.StopServerArgs) {
            const itemMap = this.parseServerFields(item)
            const ctrlProcessPath = this.getControlProcessPath(itemMap)
            const command = `${ctrlProcessPath} ${itemMap.StopServerArgs}`
            const workDir = Software.getDir(item)
            const options = { cwd: workDir, shell: true }
            child_process.spawn(command, [], options)
        } else {
            await ProcessExtend.kill(item.pid)
        }
    }

    static getControlProcessPath(itemMap) {
        return itemMap.ControlProcessPath ? itemMap.ControlProcessPath : itemMap.ServerProcessPath
    }

    /**
     * 解析字段里的变量字符串
     * @param item{SoftwareItem}
     */
    static parseServerFields(item) {
        const workDir = Software.getDir(item)
        const etcDir = GetDataPath.getEtcDir()
        const fields = ['ConfPath', 'ServerConfPath', 'ServerProcessPath', 'ControlProcessPath', 'StartServerArgs', 'StopServerArgs', 'ExtraProcessPath','ServerPort']
        const varMap = {
            WorkDir: workDir.replaceSlash(),
            EtcDir: path.join(etcDir, item.DirName).replaceSlash()
        }
        const itemMap = {}
        for (const field of fields) {
            if (Object.hasOwn(item, field)) itemMap[field] = item[field]
        }

        for (let i = 0; i < 3; i++) { //最多解析嵌套的层数为3层
            for (const field in itemMap) {
                itemMap[field] = parseTemplateStrings(itemMap[field], { ...itemMap, ...varMap })
            }
        }

        return itemMap
    }
}
