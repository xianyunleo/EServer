import ProcessExtend from "@/main/core/ProcessExtend";
import Software from "@/main/core/software/Software";
import { parseTemplateStrings} from "@/shared/utils/utils";
import child_process from "child_process";
import App from "@/main/App";
import Path from "@/main/utils/Path";

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
        const options = {cwd: workPath};

        let commandStr;

        if (item.StartServerCommand) {
            let tempStr = item.StartServerCommand.trim();
            let argObj = {
                ServerProcessPath: serverProcessPath,
                WorkPath: workPath,
                ConfPath: item.ConfPath ? Path.Join(workPath, item.ConfPath) : null,
                ServerConfPath: item.ServerConfPath ? Path.Join(workPath, item.ServerConfPath) : null,
                ExtraProcessPath: item.ExtraProcessPath ? Path.Join(workPath, item.ExtraProcessPath) : null,
            };
            commandStr = parseTemplateStrings(tempStr, argObj);
            if (App.isDev()) console.log('ServerControl.start command', commandStr)
        } else {
            commandStr = serverProcessPath;
        }

        item.isRunning = true;
        item.errMsg = '';
        child_process.exec(commandStr, options, (error, stdout, stderr) => {
            item.isRunning = false;
            if (stderr) {
                item.errMsg = stderr;
            }
        });
    }

    /**
     * SoftwareItem
     * @param softItem{SoftwareItem}
     * @returns {Promise<void>}
     */
    static async stop(softItem) {
        let processName = Path.GetBaseName(softItem.ServerProcessPath);
        await ProcessExtend.killByName(processName);
    }

    /**
     *
     * @returns {Promise<Awaited<*>[]>}
     */
    static async killWebServer() {
        return await Promise.all([
            ProcessExtend.killByName('httpd'),
            ProcessExtend.killByName('nginx'),
        ]);
    }


}
