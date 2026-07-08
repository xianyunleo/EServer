import { isWindows } from '@/shared/utils/utils2'
import path from 'path'
import { sleep } from '@/shared/utils/utils'
import FileUtil from '@/main/utils/FileUtil'
import TcpProcess from '@/main/utils/TcpProcess'
import ProcessExtend from '@/main/utils/ProcessExtend'
import child_process from 'child_process'

export default class MySQLBase {
    static getMySQLDFilePath(mysqlDir) {
        const name = isWindows ? 'mysqld.exe' : 'mysqld'
        return path.join(mysqlDir, 'bin', name)
    }

    static async resetPassword(password, mysqlDir, confFilePath) {
        const resetCommand = `ALTER USER 'root'@'localhost' IDENTIFIED BY '${password}';`
        const resetPwdPath = path.join(mysqlDir, 'reset-pwd.txt')
        await FileUtil.WriteAll(resetPwdPath, resetCommand)

        let confText = await FileUtil.ReadAll(confFilePath)
        let portMatch = confText.match(/\[mysqld].*?port\s*=\s*(\d+)/s)
        let port = portMatch ? portMatch[1] : 3306

        let oldPid = await TcpProcess.getPidByPort(port)
        if (oldPid) {
            await ProcessExtend.kill(oldPid, true)
        }

        await sleep(100)

        const args = [`--defaults-file=${confFilePath}`, `--init-file=${resetPwdPath}`]
        const mysqldPath = MySQLBase.getMySQLDFilePath(mysqlDir)
        //mysqld执行此命令会一直前台运行不退出
        const childProcess = child_process.execFile(mysqldPath, args, { cwd: mysqlDir })

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
}
