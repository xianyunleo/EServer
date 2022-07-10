import {hostsPathMap} from "@/main/constant";
import fs from "fs";

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
