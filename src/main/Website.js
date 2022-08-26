import fs from "fs";
import GetPath from "@/main/GetPath";
import {fsExists, getDirsByDir} from "@/main/utils";
import Nginx from "@/main/Nginx";
import NginxWebsite from "@/main/NginxWebsite";

export default class Website {
    static async add(websiteInfo) {
        if (Nginx.websiteExists(websiteInfo.serverName)) {
            throw new Error('网站已经存在！');
        }
        if (!fsExists(websiteInfo.rootPath)) {
            try {
                fs.mkdirSync(websiteInfo.rootPath)
            } catch {
                throw new Error('创建根目录失败！');
            }
        }
        Nginx.addWebsite(websiteInfo);
    }

    static  delete(serverName) {
         Nginx.delWebsite(serverName);
    }

    static async getList(search) {
        return await Nginx.getWebsiteList(search);
    }

    static  getBasicInfo(serverName) {
        let webSite = new NginxWebsite(serverName);
        return  webSite.getBasicInfo();
    }

    static  getRewrite(serverName) {
        let webSite = new NginxWebsite(serverName);
        return webSite.getRewrite();
    }

    static getConfPath(serverName) {
        return Nginx.getWebsiteConfPath(serverName);
    }

    static getRewriteConfPath(serverName) {
        return Nginx.getWebsiteRewriteConfPath(serverName);
    }

    static async getPHPVersionList() {
        let list = getDirsByDir(GetPath.getPHPTypePath(), 'php-');

        return await Promise.all(list.map(async item => {
            let matches = item.match(/php-(.+)/);
            if (!matches) {
                return false;
            }
            return {version: matches[1], name: matches[0]};
        }));
    }

    /**
     * 获取URL重写规则列表
     * @returns {Promise<string[]>}
     */
    static async getRewriteRuleList() {
        return await Nginx.getRewriteRuleList();
    }

    static getRewriteByRule(ruleName) {
        return Nginx.getRewriteByRule(ruleName);
    }

    static saveBasicInfo(serverName, websiteInfo) {
        let webSite = new NginxWebsite(serverName);
        webSite.saveBasicInfo(websiteInfo);
    }

    static saveRewrite(serverName, content) {
        let webSite = new NginxWebsite(serverName);
        webSite.saveUrlRewrite(content);
    }
}