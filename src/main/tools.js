import Command from "@/main/Command";
// eslint-disable-next-line no-unused-vars
import {APP_NAME, hostsPathMap} from "@/main/constant";

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

