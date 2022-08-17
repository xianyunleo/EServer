import fs from "fs";
import is from "electron-is";
import {openTextFile, vscodeIsInstalled} from "@/main/tools";
import Command from "@/main/Command";
import {getHostsPath} from "@/main/getPath";
import fixPath from 'fix-path';

export async function openHosts() {
    if (is.macOS()) {
        //mac下修复环境变量不识别的问题
        fixPath();
    }
    if (!await vscodeIsInstalled()) {
        throw new Error('vscode没有安装');
    }
    let path = getHostsPath();

    if (is.windows()) {
        return await openTextFile(path);
    } else {
        if (!await canEditHosts()) {
            await Command.sudoExec(`chmod 666 ${path}`);
        }
        return await openTextFile(path);
    }
}

export async function canEditHosts() {
    let path = getHostsPath();
    try {
        await fs.promises.access(path, fs.constants.R_OK | fs.constants.W_OK);
        return true;
    } catch {
        return false;
    }
}

export async function getHostsContent() {
    let path = getHostsPath();
    const options = {
        encoding: 'utf8',
    }
    return await fs.promises.readFile(path, options)
}

export async function setHostsContent(text) {
    const options = {
        encoding: 'utf8',
    }
    return await fs.promises.writeFile(text, options)
}

