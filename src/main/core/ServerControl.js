import ProcessExtend from "@/main/core/ProcessExtend";
import Software from "@/main/core/software/Software";
import {enumGetName, parseTemplateStrings} from "@/shared/utils/utils";
import child_process from "child_process";
import GetPath from "@/shared/utils/GetPath";
import {EnumSoftwareType} from "@/shared/enum";
import Command from "@/main/core/Command";
import Directory from "@/main/utils/Directory";
import File from "@/main/utils/File";
import App from "@/main/App";
import Path from "@/main/utils/Path";
import OS from "@/main/core/OS";

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
        //杀死同名的或者同类的其他服务
        if (item.Name === 'Nginx') {
            ServerControl.startPHPFPM();
            await ServerControl.killWebServer();
        } else {
            let processName = Path.GetBaseName(serverProcessPath);
            await ProcessExtend.killByName(processName);
        }

        let commandStr;

        if (item.StartServerCommand) {
            let tempStr = item.StartServerCommand.trim();
            let argObj = {
                ServerProcessPath: serverProcessPath,
                WorkPath: workPath,
                ServerConfPath: item.ServerConfPath ? Path.Join(workPath, item.ServerConfPath) : null,
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
        const item = softItem;
        let processName = Path.GetBaseName(item.ServerProcessPath);

        await ProcessExtend.killByName(processName);

        if (item.Name === 'Nginx') {
            await ServerControl.killPHPFPM();
        }
    }

    static async killPHPFPM() {
        if (OS.isWindows()) {
            return await Promise.all([
                ProcessExtend.killByName(ServerControl.WinPHPFPM_ProcessName),
                ProcessExtend.killByName(ServerControl.WinPHPCGI_ProcessName),
            ]);
        } else {
            await ProcessExtend.killByName('php-fpm');
        }

    }

    static async startPHPFPM() {
        await ServerControl.killPHPFPM();

        let nginxVhostsPath = GetPath.getNginxVhostsPath();
        let vhosts =  Directory.GetFiles(nginxVhostsPath, '.conf');
        if (!vhosts || vhosts.length === 0) {
            return;
        }
        //获取所有网站PHP版本数组，并发读文件并匹配PHP版本
        let phpVersionList = await Promise.all(vhosts.map(async confPath => {
            let text = File.ReadAllText(confPath);
            let matches = text.match(/php-(\S+?)\.conf/);
            return matches ? matches[1] : null;
        }));

        phpVersionList = new Set(phpVersionList); //去重
        phpVersionList = Array.from(phpVersionList).filter(item => item !== null);

        const softwareList = Software.getList();
        const phpItemMap = new Map();
        for (const item of softwareList) {
            if (item.Type !== enumGetName(EnumSoftwareType, EnumSoftwareType.PHP)) {
                continue;
            }
            phpItemMap.set(item.Name, item);
        }

        try {
            await Promise.all(phpVersionList.map(async phpVersion => {
                const phpName = `PHP-${phpVersion}`;
                const item = phpItemMap.get(phpName);

                let workPath = Software.getPath(item); //服务目录
                let serverProcessPath = Path.Join(workPath, item.ServerProcessPath);  //服务的进程目录

                let tempStr = item.StartServerCommand.trim();
                let argObj = {
                    ServerProcessPath: serverProcessPath,
                    ConfPath: Path.Join(workPath, item.ConfPath),
                    ServerConfPath: Path.Join(workPath, item.ServerConfPath),
                };

                if (item.ExtraProcessPath) {
                    argObj.ExtraProcessPath = Path.Join(workPath, item.ExtraProcessPath);
                }

                let commandStr = parseTemplateStrings(tempStr, argObj);
                const options = {cwd: workPath};
                await Command.exec(commandStr, options);
            }));
            // eslint-disable-next-line no-empty
        } catch {

        }
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
