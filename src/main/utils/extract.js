import Command from "@/main/utils/Command";
import extract from 'extract-zip'

export async function extractZip(path, dest) {
    return await extract(path, {dir: dest});
}


export async function extract7z(path, dest) {
    const _7z = require('7zip-min-electron');
    return new Promise((resolve, reject) => {
        _7z.unpack(path, dest, (err) => {
            err ? reject(err) : resolve(true);
        });
    });
}

export async function extractTar(path, dest) {
    let commandStr;
    if (path.endsWith('.tar.xz')) {
        commandStr = `tar -xf ${path} -C ${dest}`;
    }
    await Command.exec(commandStr);
}
