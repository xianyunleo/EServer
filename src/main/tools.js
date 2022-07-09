import Command from "@/main/Command";
import {hostsPathMap} from "@/main/constant";

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

export async function openHosts() {
    if (!await vscodeIsInstalled()) {
        throw new Error('vscode没有安装');
    }
    let path = hostsPathMap[process.platform];
    return await openTextFile(path, false);
}
