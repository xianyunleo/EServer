import Nginx from "@/main/core/Nginx";
import NginxWebsite from "@/main/core/website/NginxWebsite";
import File from "@/main/utils/File";
import Directory from "@/main/utils/Directory";

export default class Website {
    static add(websiteInfo) {
        if (Nginx.websiteExists(websiteInfo.serverName)) {
            throw new Error('网站已经存在！');
        }
        if (!File.Exists(websiteInfo.rootPath)) {
            try {
                Directory.CreateDirectory(websiteInfo.rootPath)
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

    static getRewrite(serverName) {
        return NginxWebsite.getRewrite(serverName);
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
        return Nginx.getRewriteRuleList();
    }

    static getRewriteByRule(ruleName) {
        return Nginx.getRewriteByRule(ruleName);
    }

    static saveBasicInfo(serverName, websiteInfo) {
        let webSite = new NginxWebsite(serverName);
        webSite.setBasicInfo(websiteInfo);
        webSite.save();
    }

    static saveRewrite(serverName, content) {
        NginxWebsite.saveRewrite(serverName, content);
    }
}
