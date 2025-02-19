import path from "path";
import GetDataPath from "@/shared/utils/GetDataPath";
import Shell from "@/main/utils/Shell";
import ProcessExtend from "@/main/utils/ProcessExtend";
import {sleep} from "@/shared/utils/utils";
import child_process from "child_process";
import FileUtil from "@/main/utils/FileUtil";
import TcpProcess from "@/main/utils/TcpProcess";
import { isWindows } from '@/main/utils/utils'

export default class Database {
    /**
     *
     * @param version {string}
     * @returns {Promise<void>}
     */
    static async initMySQLData(version) {
        let mysqlPath = GetDataPath.getMysqlDir(version);
        let command = `${this.getMySQLDFilePath(version)} --defaults-file=${this.getMySQLConfFilePath(version)} --initialize`;
        await Shell.exec(command, {cwd: mysqlPath});
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
        let mysqlPath = GetDataPath.getMysqlDir(version);
        let resetPwdPath = path.join(mysqlPath, 'reset-pwd.txt');
        await FileUtil.WriteAll(resetPwdPath, resetCommand);

        let confFilePath = this.getMySQLConfFilePath(version);
        let confText = await FileUtil.ReadAll(confFilePath)
        let portMatch = confText.match(/\[mysqld].*?port\s*=\s*(\d+)/s)
        let port = portMatch ? portMatch[1] : 3306;

        let oldPid = await TcpProcess.getPidByPort(port);
        if (oldPid) {
            await ProcessExtend.kill(oldPid);
        }

        await sleep(100);

        const args = [`--defaults-file=${confFilePath}`, `--init-file=${resetPwdPath}`]
        const mysqldPath = this.getMySQLDFilePath(version)
        //mysqld执行此命令会一直前台运行不退出
        const childProcess = child_process.execFile(mysqldPath, args, { cwd: mysqlPath })

        for (let i = 0; i < 30; i++) {
            await sleep(500)
            let path = await TcpProcess.getPathByPort(port)
            if (path === mysqldPath) {
                break
            }
        }
        await sleep(100)
        await ProcessExtend.kill(childProcess.pid)
        await FileUtil.Delete(resetPwdPath)
    }

    static getMySQLConfFilePath(version) {
        const etcDir = GetDataPath.getOwnEtcDir(`mysql-${version}`)
        let name = isWindows ? 'my.ini' : 'my.cnf'
        return path.join(etcDir, name)
    }

    static getMySQLDFilePath(version) {
        let mysqlPath = GetDataPath.getMysqlDir(version);
        let name = isWindows ? 'mysqld.exe' : 'mysqld';
        return path.join(mysqlPath, 'bin', name);
    }
}
