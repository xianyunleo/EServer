import {EOL} from "os";
import fs from "fs";
import path from "path";
import {CONF_INDENT} from "@/main/constant";
import GetPath from "@/shared/utils/GetPath";
import NginxWebsite from "@/main/core/website/NginxWebsite";
import {getFilesByDir, fsExists, getFilNameWithoutExt, fsDelete} from "@/main/utils/utils";

const N = EOL;
const T = CONF_INDENT;

export default class Nginx {
    /**
     * 获取网站列表
     * @param search {string}
     * @returns {Promise<string[]>}
     */
    static async getWebsiteList(search) {
        let vhostsPath = GetPath.getNginxVhostsPath();
        if (!fsExists(vhostsPath)) {
            return [];
        }
        let files = getFilesByDir(vhostsPath, search);
        return await Promise.all(files.map(async name => {
            let serverName = getFilNameWithoutExt(name);
            let webSite = new NginxWebsite(serverName);
            return webSite.getBasicInfo();
        }));
    }

    /**
     * 添加网站
     * @param websiteInfo {WebsiteItem}
     */
    static addWebsite(websiteInfo) {
        let confText =
            `server
{
    listen ${websiteInfo.port};
    server_name ${websiteInfo.serverName};
    index index.html index.htm index.php;
    root  ${websiteInfo.rootPath};

    autoindex on;
    
    #PHP_START
    #PHP_END

    #301_START
    #301_END

    #HTTP_TO_HTTPS_START
    #HTTP_TO_HTTPS_END

    #SSL_START
    #SSL_END

    #REWRITE_START
    include vhosts/rewrite/${websiteInfo.serverName}.conf
    #REWRITE_END
    
    #EXTRA_INFO_START
    #
    #EXTRA_INFO_END

    #DENY_FILES_START
    location ~ ^/(\\.user.ini|\\.htaccess|\\.git|\\.svn|\\.project|LICENSE|README.md)
    {
        return 403;
    }
    #DENY_FILES_END

    location ~ .+\\.(gif|jpg|jpeg|png|bmp|swf)$
    {
        expires      1d;
        error_log off;
        access_log off;
    }

    location ~ .+\\.(js|css)$
    {
        expires      1h;
        error_log off;
        access_log off;
    }

    location = /favicon.ico {
        log_not_found off;
        access_log off;
    }

    access_log  logs/${websiteInfo.serverName}.access.log;
    error_log  logs/${websiteInfo.serverName}.error.log;
}`;

        confText = Nginx.replaceConfPHPVersion(websiteInfo.phpVersion, confText);

        let confPath = Nginx.getWebsiteConfPath(websiteInfo.serverName);
        fs.writeFileSync(confPath, confText);

        //创建URL重写文件
        let rewritePath = Nginx.getWebsiteRewriteConfPath(websiteInfo.serverName);
        if (!fsExists(rewritePath)) {
            fs.writeFileSync(rewritePath, '');
        }
    }

    static delWebsite(serverName) {
        let confPath = Nginx.getWebsiteConfPath(serverName);
        if (fsExists(confPath)) {
            fsDelete(confPath);
        }
        let rewritePath = Nginx.getWebsiteRewriteConfPath(serverName);
        if (fsExists(rewritePath)) {
            fsDelete(rewritePath);
        }
    }

    static websiteExists(serverName) {
        let vhosts = getFilesByDir(GetPath.getNginxVhostsPath(), '.conf');
        return vhosts.includes(`${serverName}.conf`)
    }

    static getWebsiteConfPath(serverName) {
        return path.join(GetPath.getNginxVhostsPath(), `${serverName}.conf`);
    }

    static getWebsiteRewriteConfPath(serverName) {
        return path.join(GetPath.getNginxVhostsRewritePath(), `${serverName}.conf`);
    }

    /**
     * 获取URL重写规则列表
     * @returns {Promise<string[]>}
     */
    static async getRewriteRuleList() {
        let rewritePath = GetPath.getNginxRewritePath();
        if (!fsExists(rewritePath)) {
            return [];
        }
        let files = getFilesByDir(rewritePath, '.conf');
        return await Promise.all(files.map(async name => {
            return getFilNameWithoutExt(name);
        }));
    }

    /**
     * 获取URL重写规则内容
     * @param ruleName {string}
     * @returns {string}
     */
    static getRewriteByRule(ruleName) {
        let rewritePath = path.join(GetPath.getNginxRewritePath(), `${ruleName}.conf`)
        if (!fsExists(rewritePath)) {
            return '';
        }
        return fs.readFileSync(rewritePath, {encoding: 'utf8'});
    }

    /**
     * 替换配置文件中的PHP版本
     * @param  phpVersion {string}
     * @param confText {string}
     * @returns {string}
     */
    static replaceConfPHPVersion(phpVersion, confText) {
        let phpPattern = /(?<=#PHP_START)[\s\S]+?(?=#PHP_END)/;
        let phpReplace;
        if (phpVersion) {
            phpReplace = `${N}${T}include php-${phpVersion}.conf;${N}${T}`;
        } else {
            phpReplace = `${N}${T}`;
        }
        confText = confText.replace(phpPattern, phpReplace);
        return confText;
    }
}