import Command from "@/main/Command";
import {shell} from "@electron/remote"
import path from "path";
import {getIconPath} from "@/main/software/software";


export async function openTextFile(filePath, isSudo = false) {
    let command = `code ${filePath}`;
    if (isSudo) {
        return await Command.sudoExec(command);
    } else {
        return await Command.exec(command);
    }
}

export async function vscodeIsInstalled() {
    let command = "code -v";
    let output = await Command.exec(command);
    let reg = /\d+\.\d+\.\d+/;
    return reg.test(output)
}

export async function openUrl(url) {
    return await shell.openExternal(url);
}

export function getMysqlIconPath() {
    return 'file://'+path.join(getIconPath(),'mysql.png')
}
