import {hostsPathMap} from "@/main/constant";
import fs from "fs";
import {openTextFile, vscodeIsInstalled} from "@/main/tools";
import is from "electron-is";
import Command from "@/main/Command";


export async function openHosts() {
    if (!await vscodeIsInstalled()) {
        throw new Error('vscode没有安装');
    }
    let path = hostsPathMap[process.platform];

    if (is.windows()) {
        return await openTextFile(path);
    } else {
        if (!canEditHosts()) {
             await Command.sudoExec(`chmod 666 ${path}`);
        }
        return await openTextFile(path);
    }
}

export async function canEditHosts() {
    let path = hostsPathMap[process.platform];
    return await fs.promises.access(path, fs.constants.R_OK | fs.constants.W_OK);
}

export async function getHostsContent() {
    let path = hostsPathMap[process.platform];
    const options = {
        encoding: 'utf8',
    }
    return await  fs.promises.readFile(path,options)
}

export async function setHostsContent(text) {
    const options = {
        encoding: 'utf8',
    }
    return await  fs.promises.writeFile(text,options)
}

