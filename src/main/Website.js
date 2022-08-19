import fs from "fs";
import { getPHPPath} from "@/main/getPath";
import {getDirsByDir, fsExists} from "@/main/utils";
import {STATIC_WEB_NAME} from "@/main/constant";
import Nginx from "@/main/Nginx";
import NginxWebsite from "@/main/NginxWebsite";

export default class Website {
    static async add(websiteInfo) {
        if (await Nginx.websiteExists(websiteInfo.serverName)) {
            throw new Error('添加失败，网站已经存在！');
        }
        if (!await fsExists(websiteInfo.rootPath)) {
            try {
                !await fs.promises.mkdir(websiteInfo.rootPath)
            } catch {
                throw new Error('添加失败，创建根目录失败！');
            }
        }
        await Nginx.addWebsite(websiteInfo);
    }

    static async delete(serverName) {
        await Nginx.delWebsite(serverName);
    }

    static async getList(search) {
        return await Nginx.getWebsiteList(search);
    }

    static async getBasicInfo(serverName) {
        let webSite = new NginxWebsite(serverName);
        return await webSite.getBasicInfo();
    }

    static async getRewrite(serverName) {
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
        let list = await getDirsByDir(getPHPPath(), 'php-');
        let res = list.map(item => {
            let matches = item.match(/php-(.+)/);
            if (!matches) {
                return false;
            }
            return {version: matches[1], name: matches[0]};
        });
        res.push({version: '', name: STATIC_WEB_NAME});
        return res;
    }

    /**
     * 获取URL重写规则列表
     * @returns {Promise<Awaited<{name: *, text: String}>[]>}
     */
    static async getRewriteRuleList(){
        return await Nginx.getRewriteRuleList();
    }

    static async getRewriteByRule(ruleName) {
        return await Nginx.getRewriteByRule(ruleName);
    }

    static async saveBasicInfo(serverName, websiteInfo) {
        let webSite = new NginxWebsite(serverName);
        return await webSite.saveBasicInfo(websiteInfo);
    }

    static async saveRewrite(serverName, content) {
        let webSite = new NginxWebsite(serverName);
        return await webSite.saveUrlRewrite(content);
    }
}