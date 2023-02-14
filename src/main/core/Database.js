import path from "path";
import GetPath from "@/shared/utils/GetPath";
import Command from "@/main/core/Command";
import ProcessExtend from "@/main/core/ProcessExtend";
import {sleep} from "@/shared/utils/utils";
import child_process from "child_process";
import File from "@/main/utils/File";
import OS from "@/main/core/OS";

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
        let mysqlPath = GetPath.getMysqlPath(version);
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
        let mysqlPath = GetPath.getMysqlPath(version);
        let resetPwdPath = path.join(mysqlPath, 'reset-pwd.txt');
        File.WriteAllText(resetPwdPath, resetCommand);

        let args = [`--defaults-file=${this.getMySQLConfFilePath(version)}`, `--init-file=${resetPwdPath}`]
        //mysqld执行此命令会一直前台运行不退出
        let childProcess = child_process.execFile(this.getMySQLDFilePath(version), args, {cwd: mysqlPath});
        await sleep(2000);
        await ProcessExtend.kill(childProcess.pid);
        File.Delete(resetPwdPath);
    }

    static getMySQLConfFilePath(version) {
        let mysqlPath = GetPath.getMysqlPath(version);
        let name = OS.isWindows() ? 'my.ini' : 'my.cnf';
        return path.join(mysqlPath, name);
    }

    static getMySQLDFilePath(version) {
        let mysqlPath = GetPath.getMysqlPath(version);
        let name = OS.isWindows() ? 'mysqld.exe' : 'mysqld';
        return path.join(mysqlPath, 'bin', name);
    }
}
