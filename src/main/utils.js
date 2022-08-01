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

export async function linuxFileCopy(sourcePath,targetPath) {
    let command = `cp -r ${sourcePath} ${targetPath}`;
    return await Command.exec(command);
}