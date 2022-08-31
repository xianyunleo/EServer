import fs from "fs";
import {fsExists} from "@/main/utils/utils";
import Nginx from "@/main/core/Nginx";
import NginxWebsite from "@/main/core/website/NginxWebsite";

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