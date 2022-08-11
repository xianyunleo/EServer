//通用且与项目无关的方法
import fs from "fs";
import Command from "@/main/Command";

export async function fileExists(path) {
    try {
        await fs.promises.access(path);
        return true;
    }catch{
        return false;
    }
}

export async function dirGetFiles(dirPath, search = null) {
    let files = await fs.promises.readdir(dirPath, {withFileTypes: true});
    return files.filter((item) => {
        if (item.isDirectory()) {
            return false;
        }
        if (search) {
            return item.name.includes(search);
        }
        return true;
    }).map(item => item.name);
}

export async function linuxFileCopy(sourcePath,targetPath) {
    let command = `cp -r ${sourcePath} ${targetPath}`;
    return await Command.exec(command);
}

export async function linuxFileMove(sourcePath,targetPath) {
    let command = `mv ${sourcePath} ${targetPath}`;
    return await Command.exec(command);
}