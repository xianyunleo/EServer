import { isDev, isWindows } from '@/main/utils/utils'
import ProcessExtend from "@/main/utils/ProcessExtend";
import Software from "@/main/core/software/Software";
import { parseTemplateStrings} from "@/shared/utils/utils";
import child_process from "child_process";
import Path from "@/main/utils/Path";
import FileUtil from "@/main/utils/FileUtil";

export default class ServerControl {
    /**
     * SoftwareItem
     * @param item {SoftwareItem}
     * @returns {Promise<void>}
     */
    static async start(item) {
        const workPath = Software.getPath(item) //服务目录
        const serverProcessPath = Path.Join(workPath, item.ServerProcessPath) //服务进程的目录
        const options = { cwd: workPath, detached: true }

        if (item.ShellServerProcess) {
            options.detached = false
            options.shell = true //使用shell，childProcess返回的pid是shell的pid
        }

        if (!await FileUtil.Exists(serverProcessPath)) {
            throw new Error(`${serverProcessPath} 文件不存在！`);
        }

        let args = []
        if (item.StartServerArgs) {
            args = this.parseServerArgs(item, item.StartServerArgs)
        }

        item.isRunning = true
        item.errMsg = ''

        const childProcess = child_process.spawn(serverProcessPath, args, options);

        childProcess.stderr.on('data', (data) => {
            console.log('stderr data',data?.toString())
            item.errMsg = data?.toString();
        });

        childProcess.on('close', (code) => {
            if (isDev) console.log(`${Path.GetBaseName(serverProcessPath)},exit code ${code}`);
            item.isRunning = false;
        });

        if (isDev) console.log('ServerControl start command:', `${serverProcessPath} ${args.join(' ')}`);
        if (isDev) console.log(`${Path.GetBaseName(serverProcessPath)},pid ${childProcess.pid}`);

        item.pid = childProcess.pid;
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
            const serverProcessPath = Path.Join(workPath, item.ServerProcessPath)
            child_process.spawn(serverProcessPath, args, options)
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
                ServerProcessPath: Path.Join(workPath, item.ServerProcessPath).replaceSlash(),
                ConfPath: item.ConfPath ? Path.Join(workPath, item.ConfPath).replaceSlash() : null,
                ServerConfPath: item.ServerConfPath ? Path.Join(workPath, item.ServerConfPath).replaceSlash() : null,
                ExtraProcessPath: item.ExtraProcessPath ? Path.Join(workPath, item.ExtraProcessPath).replaceSlash() : null
            }
            return parseTemplateStrings(arg, argObj)
        })
    }
}
