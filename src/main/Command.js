import child_process from "child_process";
import sudo from "sudo-prompt"

export default class Command {
    static async exec(command) {
        return await new Promise(function (resolve, reject) {
            let formatCommand = '@chcp 65001 >nul & cmd /d/s/c ';
            command = formatCommand + command;
            const bufferEncoding = "utf8";
            const options = {
                encoding: bufferEncoding
            }
            child_process.exec(command, options, (err, stdout, stderr) => {
                if (err) {
                    err = new Error(err.message.replace(formatCommand, ''))
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
        return await new Promise(function (resolve, reject) {
            const options = {
                name: 'Electron',
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



