import path from "path";
import GetPath from "@/shared/utils/GetPath";
import Command from "@/main/core/Command";
import ProcessExtend from "@/main/core/ProcessExtend";
import {sleep} from "@/shared/utils/utils";
import child_process from "child_process";
import File from "@/main/utils/File";
import OS from "@/main/core/OS";
import TcpProcess from "@/main/core/TcpProcess";

export default class Database {

    /**
     *
     * @param version {string}
     * @returns {Promise<void>}
     */
    static async initMySQL(version) {
        //mysql user的密码在mysql data目录
        await Database.initMySQLData(version);
        await Database.resetMySQLPassword(version);
    }

    /**
     *
     * @param version {string}
     * @returns {Promise<void>}
     */
    static async initMySQLData(version) {
        let mysqlPath = GetPath.getMysqlDir(version);
        let command = `${this.getMySQLDFilePath(version)} --defaults-file=${this.getMySQLConfFilePath(version)} --initialize`;
        await Command.exec(command, {cwd: mysqlPath});
    }

    /**
     *
     * @param version {string}
     * @param password {string}
     * @returns {Promise<void>}
     */
    static async resetMySQLPassword(version, password) {
        if (!password) {
            password = 'root';
        }
        let resetCommand;
        switch (version) {
            case '5.7':
            case '8.0':
                resetCommand = `ALTER USER 'root'@'localhost' IDENTIFIED BY '${password}';`;
                break;
            default:
        }
        let mysqlPath = GetPath.getMysqlDir(version);
        let resetPwdPath = path.join(mysqlPath, 'reset-pwd.txt');
        File.WriteAllText(resetPwdPath, resetCommand);

        let confFilePath = this.getMySQLConfFilePath(version);
        let portMatch = File.ReadAllText(confFilePath).match(/\[mysqld].*?port\s*=\s*(\d+)/s);
        let port = portMatch ? portMatch[1] : 3306;

        let oldPid = await TcpProcess.getPidByPort(port);
        if(oldPid){
            await ProcessExtend.kill(oldPid);
        }

        await sleep(100);

        let args = [`--defaults-file=${confFilePath}`, `--init-file=${resetPwdPath}`];
        let mysqldPath = this.getMySQLDFilePath(version);
        //mysqld执行此命令会一直前台运行不退出
        let childProcess = child_process.execFile(mysqldPath, args, {cwd: mysqlPath});

        for (let i = 0; i < 10; i++) {
            await sleep(500);
            let path = await TcpProcess.getPathByPort(port);
            if (path === mysqldPath) {
                break;
            }
        }
        await sleep(100);
        await ProcessExtend.kill(childProcess.pid);
        File.Delete(resetPwdPath);
    }

    static getMySQLConfFilePath(version) {
        let mysqlPath = GetPath.getMysqlDir(version);
        let name = OS.isWindows() ? 'my.ini' : 'my.cnf';
        return path.join(mysqlPath, name);
    }

    static getMySQLDFilePath(version) {
        let mysqlPath = GetPath.getMysqlDir(version);
        let name = OS.isWindows() ? 'mysqld.exe' : 'mysqld';
        return path.join(mysqlPath, 'bin', name);
    }
}
