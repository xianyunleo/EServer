import { isDev, isWindows } from '@/main/utils/utils'
import child_process from "child_process";
import SettingsExtend from "@/main/core/SettingsExtend";
import util from "util";

export default class Shell {
    /**
     * 执行命令，等待进程退出返回结果（标准输出）
     * @param command
     * @param options
     * @returns {Promise<string>}
     */
    static async exec(command, options = {}) {
        if (isDev) console.log('Command.exec command', command);

        let formatCommand;
        if (options.chcp && isWindows) {
            formatCommand = '@chcp 65001 >nul & cmd /d/s/c ';
            command = formatCommand + command;
        }

        if (!options.encoding) {
            options.encoding = "utf8";
        }

        const exec = util.promisify(child_process.exec);

        try {
            const {stdout} = await exec(command, options);
            return stdout;
        } catch (error) {
            if (isWindows && !options.shell) {
                // eslint-disable-next-line no-ex-assign
                error = new Error(error.message.replace(formatCommand, ''))
            }
            throw error;
        }
    }

    /**
     * 执行命令，等待进程退出返回结果（标准输出）
     * @param command
     * @param options
     * @returns {Promise<string>}
     */
    static async sudoExec(command, options = {}) {
        if (isWindows) {
            throw new Error(`Cannot be executed on Windows!`);
        }
        if (isDev) console.log('Command.sudoExec command', command);

        command = `echo '${SettingsExtend.getUserPwd()}' | sudo -S ${command}`;

        if (!options.encoding) {
            options.encoding = "utf8";
        }

        const exec = util.promisify(child_process.exec);

        const {stdout} = await exec(command, options);
        return stdout;
    }
}



