import fs from "fs";
import path from "path";
import sudo from "sudo-prompt"
import ProcessExtend from "@/main/core/ProcessExtend";
import Software from "@/main/core/software/Software";
import {getFilesByDir} from "@/main/utils/utils";
import {enumGetName, parseTemplateStrings, sleep} from "@/shared/utils/utils";
import child_process from "child_process";
import GetPath from "@/shared/utils/GetPath";
import {EnumSoftwareType} from "@/shared/enum";
import Command from "@/main/core/Command";
import {APP_NAME} from "@/shared/constant";
import OS from  "@/main/core/OS";
import is from "electron-is";

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
        const options = {cwd: workPath};
        //杀死同名的或者同类的其他服务
        if (item.Name === 'Nginx') {
            await ServerControl.killPHPFPM();
            ServerControl.startPHPFPM();
            await ServerControl.killWebServer();
        } else {
            let processName = path.parse(serverProcessPath)?.name;
            await ProcessExtend.killByName(processName);
        }

        let commandStr;

        if (item.StartServerCommand) {
            let tempStr = item.StartServerCommand.trim();
            let argObj = {
                ServerProcessPath: serverProcessPath,
                WorkPath: workPath,
                ServerConfPath: item.ServerConfPath ? path.join(workPath, item.ServerConfPath) : null,
            };
            commandStr = parseTemplateStrings(tempStr, argObj);
            console.log('commandStr',commandStr)
        } else {
            commandStr = serverProcessPath;
        }

        let exec;
        if (ServerControl.useSudoExec(item.Name)) {
            exec = sudo.exec; //todo用sudo.exec服务状态好像有问题
            options.name = APP_NAME;
        } else {
            exec = child_process.exec;
        }

        item.isRunning = true;
        item.errMsg = '';
        exec(commandStr, options, (error, stdout, stderr) => {
            console.log('exec callback')
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

        if (ServerControl.useSudoExec(item.Name)) {
            await ProcessExtend.killByName(processName, true);
        } else {
            await ProcessExtend.killByName(processName);
        }

        await sleep(100);//等待回调函数改变 item.isRunning 的状态，todo改ps查询
        if (item.Name === 'Nginx') {
            if (!item.isRunning) { //nginx杀死成功，再杀php-fpm
                await ServerControl.killPHPFPM();
            }
        }
    }

    static async killPHPFPM() {
        await ProcessExtend.killByName('php-fpm');
    }

    static async startPHPFPM() {
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

    /**
     * 根据软件名判断是否使用sudoExec
     * @param itemName {string}
     * @returns {boolean}
     */
    static useSudoExec(itemName) {
        if (is.macOS()) {
            let mainVersion = OS.getReleaseVersion().split('.')[0];
            const itemNameArr = ['Nginx'];
            //https://en.wikipedia.org/wiki/Darwin_(operating_system)
            //<=macOS 10.13 High Sierra
            if (Number(mainVersion) <= 17 && itemNameArr.includes(itemName)) {
                return true;
            }
        }
        return false;
    }
}