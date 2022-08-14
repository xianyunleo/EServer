import fs from "fs";
import path from "path";
import {getNginxVhostsPath} from "@/main/getPath";
export default class NginxWebsite {
    confText;
    serverName;
    constructor(serverName) {
       this.serverName = serverName;
    }
    async init() {
        let filepath = this.getConfPath();
        this.confText = await fs.promises.readFile(filepath,{encoding:'utf8'});
    }

    getConfPath(){
        return path.join(getNginxVhostsPath(), `${this.serverName}.conf`);
    }

     getPort() {
        let matches = this.confText.match(/listen\s+(\d+)\s*;/)
        return matches ? matches[1] : null;
    }

     getPath() {
        let matches = this.confText.match(/root\s+(\S+)\s*;/)
        return matches ? matches[1] : null;
    }

     getPHPVersion() {
        let matches = this.confText.match(/php-(\S+?)\.conf/)
        return matches ? matches[1] : null;
    }
}