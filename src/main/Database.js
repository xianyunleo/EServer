import path from "path";
import GetPath from "@/main/GetPath";
import fs from "fs";
import Command from "@/main/Command";


export default class Database {

    static async initMySQL() {

    }

    static async initMySQLData(version) {
        let mysqlPath = GetPath.getMysqlPathByVersion(version);
        let confPath = path.join(mysqlPath, 'my.cnf');
        let command = `${mysqlPath} --defaults-file=${confPath} --initialize`;
        await Command.exec(command, {cwd: mysqlPath});
    }

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
        let resetPwdPath = path.join(mysqlPath, 'reset-pwd.txt');
        await fs.promises.writeFile(resetPwdPath, resetCommand);
        let command = `${mysqlPath} --init-file=${resetPwdPath}`;
        await Command.exec(command, {cwd: mysqlPath});
    }

}