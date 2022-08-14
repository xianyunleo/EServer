import fs from "fs";
import Nginx from "@/main/Nginx";
import {STATIC_WEB_NAME} from "@/main/constant";

export default class NginxWebsite {
    confText;
    serverName;

    constructor(serverName) {
        this.serverName = serverName;
    }

    async init() {
        let confPath = Nginx.getWebsiteConfPath(this.serverName);
        this.confText = await fs.promises.readFile(confPath, {encoding: 'utf8'});
    }

    getConf(){
        return {
            ...this.getBasicConf(),
            urlRewrite:this.getUrlRewrite() ?? '',
        }
    }

    getBasicConf(){
        return {
            serverName: this.serverName,
            port: this.getPort(),
            path: this.getPath(),
            phpVersion:this.getPHPVersion() ?? STATIC_WEB_NAME,
        }
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

    getUrlRewrite(){
        let matches= this.confText.match(/(?<=#REWRITE_START)[\s\S]+?(?=#REWRITE_END)/);
        if(matches){
            return  matches[0].trim();
        }
        return '';
    }
}