import fs from "fs";
import path from "path";
import GetPath from "@/shared/utils/GetPath";
import NginxWebsite from "@/main/core/website/NginxWebsite";
import Directory from "@/main/utils/Directory";
import File from "@/main/utils/File";
import Path from "@/main/utils/Path";

export default class Nginx {
    /**
     * 获取网站列表
     * @param search {string}
     * @returns {Promise<string[]>}
     */
    static async getWebsiteList(search) {
        let vhostsPath = GetPath.getNginxVhostsPath();
        if (!Directory.Exists(vhostsPath)) {
            return [];
        }
        let files = Directory.GetFiles(vhostsPath, search);
        return await Promise.all(files.map(async name => {
            let serverName = Path.GetFileNameWithoutExtension(name);
            let webSite = new NginxWebsite(serverName);
            return webSite.getBasicInfo();
        }));
    }

    /**
     * 添加网站
     * @param websiteInfo {WebsiteItem}
     */
    static addWebsite(websiteInfo) {
        let serverName = websiteInfo.serverName;
        serverName = websiteInfo.extraServerName ? `${serverName} ${websiteInfo.extraServerName}` : serverName;
        let confText =
            `server
{
    listen ${websiteInfo.port};
    server_name ${serverName};
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
    include vhosts/rewrite/${websiteInfo.serverName}.conf;
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

        let confPath = Nginx.getWebsiteConfPath(websiteInfo.serverName);
        fs.writeFileSync(confPath, confText);

        let website = new NginxWebsite(websiteInfo.serverName);
        website.setPHPVersion(websiteInfo.phpVersion);
        website.setExtraInfo({allowSyncHosts: websiteInfo.allowSyncHosts});
        website.save();

        //创建URL重写文件
        let rewritePath = Nginx.getWebsiteRewriteConfPath(websiteInfo.serverName);
        if (!File.Exists(rewritePath)) {
            fs.writeFileSync(rewritePath, '');
        }
    }

    static delWebsite(serverName) {
        let confPath = Nginx.getWebsiteConfPath(serverName);
        if (File.Exists(confPath)) {
            File.Delete(confPath);
        }
        let rewritePath = Nginx.getWebsiteRewriteConfPath(serverName);
        if (File.Exists(rewritePath)) {
            File.Delete(rewritePath);
        }
    }

    static websiteExists(serverName) {
        let vhosts = Directory.GetFiles(GetPath.getNginxVhostsPath(), '.conf');
        return vhosts.includes(Path.Join(GetPath.getNginxVhostsPath(), `${serverName}.conf`));
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
    static getRewriteRuleList() {
        let rewritePath = GetPath.getNginxRewritePath();
        if (!File.Exists(rewritePath)) {
            return [];
        }
        let files = Directory.GetFiles(rewritePath, '.conf');
        return files.map(name => {
            return Path.GetFileNameWithoutExtension(name);
        });
    }

    /**
     * 获取URL重写规则内容
     * @param ruleName {string}
     * @returns {string}
     */
    static getRewriteByRule(ruleName) {
        let rewritePath = path.join(GetPath.getNginxRewritePath(), `${ruleName}.conf`)
        if (!File.Exists(rewritePath)) {
            return '';
        }
        return File.ReadAllText(rewritePath);
    }
}
