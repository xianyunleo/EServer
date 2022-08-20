//通用且与项目无关的方法
import fs from "fs";
import path from "path";

export async function fsExists(path) {
    try {
        await fs.promises.access(path);
        return true;
    } catch {
        return false;
    }
}

export function fsExistsSync(path) {
    try {
        fs.accessSync(path);
        return true;
    } catch {
        return false;
    }
}

export async function fsMove(sourcePath, targetPath) {
    return await fs.promises.rename(sourcePath, targetPath);
}

export async function fsDelete(path) {
    return await fs.promises.rm(path);
}

export function getFilNameWithoutExt(filename) {
    return path.parse(filename).name;
}

export async function getFilesByDir(dirPath, search = null) {
    let files = await fs.promises.readdir(dirPath, {withFileTypes: true});
    return files.filter((item) => {
        if (item.name.charAt(0) === '.' || !item.isFile()) {
            return false;
        }
        if (search) {
            return item.name.includes(search);
        }
        return true;
    }).map(item => item.name);
}

export async function getDirsByDir(dirPath, search = null) {
    let files = await fs.promises.readdir(dirPath, {withFileTypes: true});
    return files.filter((item) => {
        if (item.name.charAt(0) === '.' || !item.isDirectory()) {
            return false;
        }
        if (search) {
            return item.name.includes(search);
        }
        return true;
    }).map(item => item.name);
}

