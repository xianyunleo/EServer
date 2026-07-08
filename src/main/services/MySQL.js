import path from 'path'
import GetDataPath from '@/shared/helpers/GetDataPath'
import Command from '@/main/utils/Command'
import ProcessExtend from '@/main/utils/ProcessExtend'
import { sleep } from '@/shared/utils/utils'
import child_process from 'child_process'
import FileUtil from '@/main/utils/FileUtil'
import TcpProcess from '@/main/utils/TcpProcess'
import { isWindows } from '@/shared/utils/utils2'
import DirUtil from '@/main/utils/DirUtil'
import MySQLBase from '@/main/services/MySQLBase'

export default class MySQL {
    static PASSWORD_ROOT = 'root'
    /**
     *
     * @param version {string}
     * @returns {Promise<void>}
     */
    static async initData(version) {
        const mysqlDir = GetDataPath.getMysqlDir(version)
        const logsDir = path.join(mysqlDir, 'logs')
        if (!(await DirUtil.Exists(logsDir))) await DirUtil.Create(logsDir)
        let command = `${MySQL.getMySQLDFilePath(version)} --defaults-file=${MySQL.getConfFilePath(version)} --initialize`
        await Command.exec(command, { cwd: mysqlDir })
    }

    /**
     * @param password {string}
     * @param version {string}
     * @returns {Promise<void>}
     */
    static async resetPassword(password, version) {
        await MySQLBase.resetPassword(password, GetDataPath.getMysqlDir(version), MySQL.getConfFilePath(version))
    }

    static getConfFilePath(version) {
        const etcDir = GetDataPath.getOwnEtcDir(`mysql-${version}`)
        const name = isWindows ? 'my.ini' : 'my.cnf'
        return path.join(etcDir, name)
    }

    static getMySQLDFilePath(version) {
        return MySQLBase.getMySQLDFilePath(GetDataPath.getMysqlDir(version))
    }
}
