import {execPromise, sudoExecPromise} from "@/main/process";

export async function openTextFile(filePath) {
    if (!await vscodeIsInstalled()) {
        throw new Error('vscode没有安装');
    }
    let command = `code ${filePath}`;
    await sudoExecPromise(command);
}

async function vscodeIsInstalled() {
    let command = "code -v";
    let output = await execPromise(command);
    let reg = /\d+\.\d+\.\d+/;
    return reg.test(output)
}


export async function openHosts() {
    await openTextFile('C:\\Windows\\System32\\drivers\\etc\\hosts');
}
