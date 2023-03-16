import path from "path";
import GetPath from "@/shared/utils/GetPath";
import NginxWebsite from "@/main/core/website/NginxWebsite";
import Directory from "@/main/utils/Directory";
import File from "@/main/utils/File";
import Path from "@/main/utils/Path";
import OS from "@/main/core/OS";

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
        return await Promise.all(files.map(async path => {
            let confName = Path.GetBaseName(path);
            let webSite = new NginxWebsite(confName);
            return webSite.getBasicInfo();
        }));
    }

    /**
     * 添加网站
     * @param websiteInfo {WebsiteItem}
     */
    static addWebsite(websiteInfo) {
        let serverName = websiteInfo.serverName;
        let serverNameStr = websiteInfo.extraServerName ? `${serverName} ${websiteInfo.extraServerName}` : serverName;
        let confName = this.getWebsiteConfName(websiteInfo.serverName, websiteInfo.port);
        let confPath = this.getWebsiteConfPath(confName);
        let confText =
            `server
{
    listen ${websiteInfo.port};
    server_name ${serverNameStr};
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
    include vhosts/rewrite/${confName};
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

    access_log  logs/${Path.GetFileNameWithoutExtension(confName)}.access.log;
    error_log  logs/${Path.GetFileNameWithoutExtension(confName)}.error.log;
}`;

        if (OS.isWindows()) {
            confText = confText.replaceAll("\n", "\r\n");
        }


        File.WriteAllText(confPath, confText);

        let website = new NginxWebsite(confName);
        website.setPHPVersion(websiteInfo.phpVersion);
        website.setExtraInfo({allowSyncHosts: websiteInfo.allowSyncHosts});
        website.save();

        //创建URL重写文件
        let rewritePath = Nginx.getWebsiteRewriteConfPath(confName);
        if (!File.Exists(rewritePath)) {
            File.WriteAllText(rewritePath, '');
        }
    }

    static delWebsite(confName) {
        let confPath = this.getWebsiteConfPath(confName);
        if (File.Exists(confPath)) {
            File.Delete(confPath);
        }

        let rewritePath = this.getWebsiteRewriteConfPath(confName);
        if (File.Exists(rewritePath)) {
            File.Delete(rewritePath);
        }
    }

    static websiteExists(serverName, port) {
        let confPath = this.getWebsiteConfPath(this.getWebsiteConfName(serverName, port));
        return File.Exists(confPath);
    }

    static getWebsiteConfPath(confName) {
        return path.join(GetPath.getNginxVhostsPath(), confName);
    }

    static getWebsiteConfName(serverName, port) {
        return `${serverName}_${port}.conf`;
    }

    static getWebsiteRewriteConfPath(confName) {
        return path.join(GetPath.getNginxVhostsRewritePath(), confName);
    }

    /**
     * 获取URL重写规则列表
     * @returns {Promise<string[]>}
     */
    static getRewriteRuleList() {
        let rewritePath = GetPath.getNginxRewritePath();
        if (!Directory.Exists(rewritePath)) {
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

    /**
     *
     * @param domain
     * @returns {Promise<number>}
     */
    static async getSameDomainAmount(domain) {
        let vhostsPath = GetPath.getNginxVhostsPath();
        if (!Directory.Exists(vhostsPath)) {
            return 0;
        }
        let files = Directory.GetFiles(vhostsPath);
        // array.filter不能使用async方法
        let list = await Promise.all(files.map(async path => {
            let confText = File.ReadAllText(path);
            let regExp = new RegExp('server_name.+' + domain.replaceAll('.', '\\.'));
            return confText.match(regExp);
        }));

        return list.filter(item => item).length;
    }
}
