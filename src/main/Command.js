import child_process from "child_process";
import sudo from "sudo-prompt"
import {APP_NAME} from "@/main/constant";
import is from "electron-is";

export default class Command {
    static async exec(command) {
        return await new Promise((resolve, reject) => {
            let formatCommand;
            if (is.windows()) {
                formatCommand = '@chcp 65001 >nul & cmd /d/s/c ';
                command = formatCommand + command;
            }

            const bufferEncoding = "utf8";
            const options = {
                encoding: bufferEncoding
            }
            child_process.exec(command, options, (err, stdout, stderr) => {
                if (err) {
                    if (is.windows()) {
                        err = new Error(err.message.replace(formatCommand, ''))
                    }
                    reject(err);
                } else if (stderr.lenght > 0) {
                    reject(new Error(stderr.toString()));
                } else {
                    resolve(stdout.toString());
                }
            });
        });
    }

    static async sudoExec(command) {
        return await new Promise((resolve, reject) => {
            const options = {
                name: APP_NAME,
            }
            sudo.exec(command, options, (err, stdout, stderr) => {
                if (err) {
                    reject(err);
                } else if (stderr.lenght > 0) {
                    reject(new Error(stderr.toString()));
                } else {
                    resolve(stdout.toString());
                }
            });
        });
    }
}



