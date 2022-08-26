import ProcessExtend from "@/main/ProcessExtend";
import path from "path";
import Software from "@/main/software/Software";
import {enumGetName, getFilesByDir, parseTemplateStrings} from "@/main/utils";
import child_process from "child_process";
import GetPath from "@/main/GetPath";
import fs from "fs";
import {EnumSoftwareType} from "@/main/enum";
import Command from "@/main/Command";

export default class ServerControl {
    /**
     * SoftwareItem
     * @param softItem
     * @returns {Promise<void>}
     */
    static async start(softItem) {
        const item = softItem;

        let workPath = Software.getPath(item); //服务目录
        let serverProcessPath = path.join(workPath, item.ServerProcessPath);  //服务的进程目录
        //杀死同名的或者同类的其他服务
        if (item.Name === 'Nginx') {
            ServerControl.startPHPFPM();
            await ServerControl.killWebServer();
        } else {
            let processName = path.parse(serverProcessPath)?.name;
            await ProcessExtend.killByName(processName);
        }


        let commandStr;

        if (item.StartServerCommand) {
            let tempStr = item.StartServerCommand.trim();
            let argObj = {ServerProcessPath: serverProcessPath, WorkPath: workPath};
            commandStr = parseTemplateStrings(tempStr, argObj);
        } else {
            commandStr = serverProcessPath;
        }

        const options = {cwd: workPath};

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
     * @param softItem
     * @returns {Promise<void>}
     */
    static async stop(softItem) {
        //todo 只杀本项目的服务
        const item = softItem;
        let processName = path.parse(item.ServerProcessPath)?.name;
        let promiseArr = [ProcessExtend.killByName(processName)];
        if (item.Name === 'Nginx') {
            promiseArr.push(ServerControl.killPHPFPM());
        }
        return await Promise.all(promiseArr);
    }

    static async killPHPFPM() {
        await ProcessExtend.killByName('php-fpm');
    }

    static async startPHPFPM() {
        await ServerControl.killPHPFPM();

        let nginxVhostsPath = GetPath.getNginxVhostsPath();
        let vhosts =  getFilesByDir(nginxVhostsPath, '.conf');
        if (!vhosts || vhosts.length === 0) {
            return;
        }
        //获取所有网站PHP版本数组，并发读文件并匹配PHP版本
        let phpVersionList = await Promise.all(vhosts.map(async fileName => {
            let confPath = path.join(nginxVhostsPath, fileName)
            let text = await fs.promises.readFile(confPath, {encoding: 'utf8'});
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

        await Promise.all(phpVersionList.map(async phpVersion => {
            const phpName = `PHP-${phpVersion}`;
            const item = phpItemMap.get(phpName);

            let workPath = Software.getPath(item); //服务目录
            let serverProcessPath = path.join(workPath, item.ServerProcessPath);  //服务的进程目录

            let tempStr = item.StartServerCommand.trim();
            let argObj = {
                ServerProcessPath: serverProcessPath,
                ConfPath: path.join(workPath, item.ConfPath),
                ServerConfPath: path.join(workPath, item.ServerConfPath),
            };
            let commandStr = parseTemplateStrings(tempStr, argObj);
            const options = {cwd: workPath};
            await Command.exec(commandStr, options);
        }));
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