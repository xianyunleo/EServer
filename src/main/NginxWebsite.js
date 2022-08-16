import fs from "fs";
import Nginx from "@/main/Nginx";
import {CONF_INDENT, STATIC_WEB_NAME} from "@/main/constant";
import {EOL} from "os";

const N = EOL;
const T = CONF_INDENT;

export default class NginxWebsite {
    serverName;
    confPath;
    confText;

    constructor(serverName) {
        this.serverName = serverName;
    }

    async init() {
        this.confPath = Nginx.getWebsiteConfPath(this.serverName);
        this.confText = await fs.promises.readFile(this.confPath, {encoding: 'utf8'});
    }

    getBasicInfo(){
        return {
            serverName: this.serverName,
            port: this.getPort(),
            rootPath: this.getRootPath(),
            phpVersion:this.getPHPVersion() ?? STATIC_WEB_NAME,
        }
    }

    getRewrite() {
        let matches = this.confText.match(/(?<=#REWRITE_START)[\s\S]+?(?=#REWRITE_END)/);
        return matches ? matches[0].trim() : '';
    }

    getPort() {
        let matches = this.confText.match(/(?<=listen\s+)\d+(?=\s*;)/);
        return matches ? matches[0] : null;
    }

    getRootPath() {
        let matches = this.confText.match(/(?<=root\s+)\S+(?=\s*;)/);
        return matches ? matches[0] : null;
    }

    getPHPVersion() {
        let matches = this.confText.match(/php-(\S+?)\.conf/);
        return matches ? matches[1] : null;
    }


    async saveBasicInfo(websiteInfo) {
        let text = this.confText;
        text = text.replace(/(?<=listen\s+)\d+(?=\s*;)/, websiteInfo.port);
        text = text.replace(/(?<=root\s+)\S+(?=\s*;)/, websiteInfo.rootPath);
        text = Nginx.replaceWebsiteConfPHPVersion(websiteInfo.phpVersion,text);
        this.confText = text;
        await this.saveInfo();
    }

    async saveUrlRewrite(content) {
        content = `${N}${content}${N}${T}`;
        this.confText = this.confText.replace(/(?<=#REWRITE_START)[\s\S]+?(?=#REWRITE_END)/, content);
        await this.saveInfo();
    }

    async saveInfo() {
        await fs.promises.writeFile(this.confPath, this.confText);
    }
}