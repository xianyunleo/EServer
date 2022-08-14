import fs from "fs";
import {getPHPPath} from "@/main/getPath";
import {dirGetDirs, fileExists} from "@/main/utils";
import {STATIC_WEB_NAME} from "@/main/constant";
import Nginx from "@/main/Nginx";
import NginxWebsite from "@/main/NginxWebsite";

export default class Website {
    static async add(webServerInfo) {
        if (await Nginx.websiteIsExist(webServerInfo.serverName)) {
            throw new Error('添加失败，网站已经存在！');
        }
        if (!await fileExists(webServerInfo.path)) {
            try {
                !await fs.promises.mkdir(webServerInfo.path)
            } catch {
                throw new Error('添加失败，创建根目录失败！');
            }
        }
        await Nginx.addWebsite(webServerInfo);
    }

    static async delete(serverName) {
        await Nginx.delWebsite(serverName);
    }

    static async getList(search) {
        return await Nginx.getWebsiteList(search);
    }

    static async getConf(serverName) {
        let webSite = new NginxWebsite(serverName);
        await webSite.init();
        return webSite.getConf();
    }

    static getConfPath(serverName) {
        return Nginx.getWebsiteConfPath(serverName);
    }

    static async getPHPVersionList() {
        let list = await dirGetDirs(getPHPPath(), 'php-');
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

}