import fs from "fs";
import Nginx from "@/main/Nginx";
import {STATIC_WEB_NAME} from "@/main/constant";

/**
 * Nginx网站类，用于生成网站对象
 */
export default class NginxWebsite {
    serverName;
    confPath;
    confText;

    constructor(serverName) {
        this.serverName = serverName;
        this.confPath = Nginx.getWebsiteConfPath(this.serverName);
    }

    async initConfText() {
        if(!this.confText){
            this.confText = await fs.promises.readFile(this.confPath, {encoding: 'utf8'});
        }
    }

    async getBasicInfo(){
        await this.initConfText();
        return {
            serverName: this.serverName,
            port: this.getPort(),
            rootPath: this.getRootPath(),
            phpVersion:this.getPHPVersion() ?? STATIC_WEB_NAME,
        }
    }

    async getRewrite() {
        let rewritePath = Nginx.getWebsiteRewriteConfPath(this.serverName);
        return await fs.promises.readFile(rewritePath, {encoding: 'utf8'});
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
        await this.initConfText();
        let text = this.confText;
        text = text.replace(/(?<=listen\s+)\d+(?=\s*;)/, websiteInfo.port);
        text = text.replace(/(?<=root\s+)\S+(?=\s*;)/, websiteInfo.rootPath);
        text = Nginx.replaceConfPHPVersion(websiteInfo.phpVersion,text);
        this.confText = text;
        await this.saveInfo();
    }

    async saveUrlRewrite(content) {
        let rewritePath = Nginx.getWebsiteRewriteConfPath(this.serverName);
        await fs.promises.writeFile(rewritePath,content);
    }

    async saveInfo() {
        await fs.promises.writeFile(this.confPath, this.confText);
    }
}