import path from "path";
import GetPath from "@/shared/utils/GetPath";
import fs from "fs";
import Command from "@/main/core/Command";
import {fsDelete} from "@/main/utils/utils";
import ProcessExtend from "@/main/core/ProcessExtend";
import {sleep} from "@/shared/utils/utils";
import child_process from "child_process";


export default class Database {

    static async initMySQL() {

    }

    /**
     *
     * @param version {string}
     * @returns {Promise<void>}
     */
    static async initMySQLData(version) {
        let mysqlPath = GetPath.getMysqlPathByVersion(version);
        let mysqlBinFilePath = path.join(mysqlPath, 'bin/mysqld');
        let confPath = path.join(mysqlPath, 'my.cnf');
        let command = `${mysqlBinFilePath} --defaults-file=${confPath} --initialize`;
        console.log('initMySQLData',command)
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
        let mysqlPath = GetPath.getMysqlPathByVersion(version);
        let confPath = path.join(mysqlPath, 'my.cnf');
        let mysqlBinFilePath = path.join(mysqlPath, 'bin/mysqld');
        let resetPwdPath = path.join(mysqlPath, 'reset-pwd.txt');
        await fs.promises.writeFile(resetPwdPath, resetCommand);

        let command = `${mysqlBinFilePath} --defaults-file=${confPath} --init-file=${resetPwdPath}`;
        //mysqld执行此命令会一直前台运行不退出
        child_process.exec(command, {cwd: mysqlPath});
        await sleep(1500);
        await ProcessExtend.killByName('mysqld');
        fsDelete(resetPwdPath);
    }

}