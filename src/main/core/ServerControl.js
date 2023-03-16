import ProcessExtend from "@/main/core/ProcessExtend";
import Software from "@/main/core/software/Software";
import { parseTemplateStrings} from "@/shared/utils/utils";
import child_process from "child_process";
import Path from "@/main/utils/Path";
import File from "@/main/utils/File";
import App from "@/main/App";

export default class ServerControl {

    static WinPHPCGI_ProcessName = 'php-cgi.exe';
    static WinPHPFPM_ProcessName = 'php-cgi-spawner.exe';


    /**
     * SoftwareItem
     * @param softItem {SoftwareItem}
     * @returns {Promise<void>}
     */
    static async start(softItem) {
        const item = softItem;
        let workPath = Software.getPath(item); //服务目录
        let serverProcessPath = Path.Join(workPath, item.ServerProcessPath);  //服务的进程目录
        let options = {cwd: workPath, detached: true};

        if (item.Name === 'MySQL-8.0') {
            options = {cwd: workPath, shell: true}; //使用shell，childProcess返回的pid是shell的pid
        }

        if (!File.Exists(serverProcessPath)) {
            throw new Error(`${serverProcessPath} 文件不存在！`);
        }

        let args = [];

        if (item.StartServerArgs) {
            args = item.StartServerArgs.map(arg => {
                let argObj = {
                    ServerProcessPath: serverProcessPath,
                    WorkPath: workPath,
                    ConfPath: item.ConfPath ? Path.Join(workPath, item.ConfPath) : null,
                    ServerConfPath: item.ServerConfPath ? Path.Join(workPath, item.ServerConfPath) : null,
                    ExtraProcessPath: item.ExtraProcessPath ? Path.Join(workPath, item.ExtraProcessPath) : null,
                };
                return parseTemplateStrings(arg, argObj);
            })
        }

        item.isRunning = true;
        item.errMsg = '';

        let childProcess = child_process.spawn(serverProcessPath, args, options);

        childProcess.stderr.on('data', (data) => {
            console.log('stderr data',data?.toString())
            item.errMsg = data?.toString();
        });

        childProcess.on('close', (code) => {
            if (App.isDev()) console.log(`${Path.GetBaseName(serverProcessPath)},exit code ${code}`);
            item.isRunning = false;
        });

        if (App.isDev()) console.log('ServerControl start command:', `${serverProcessPath} ${args.join(' ')}`);
        if (App.isDev()) console.log(`${Path.GetBaseName(serverProcessPath)},pid ${childProcess.pid}`);

        item.pid = childProcess.pid;
    }

    /**
     * SoftwareItem
     * @param softItem{SoftwareItem}
     * @returns {Promise<void>}
     */
    static async stop(softItem) {
        await ProcessExtend.kill(softItem.pid);
    }

}
