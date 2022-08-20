import {EOL} from "os";
import {CONF_INDENT} from "@/main/constant";
import path from "path";
import GetPath from "@/main/GetPath";
import fs from "fs";
import {getFilesByDir, fsExists, getFilNameWithoutExt, fsDelete} from "@/main/utils";
import NginxWebsite from "@/main/NginxWebsite";

const N = EOL;
const T = CONF_INDENT;

export default class Nginx {
    static async getWebsiteList(search) {
        let files = await getFilesByDir(GetPath.getNginxVhostsPath(), search);
        return await Promise.all(files.map(async name => {
            let serverName = getFilNameWithoutExt(name);
            let webSite = new NginxWebsite(serverName);
            return await webSite.getBasicInfo();
        }));
    }

    static async addWebsite(websiteInfo) {
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

        confText = Nginx.replaceConfPHPVersion(websiteInfo.phpVersion,confText);

        let confPath = Nginx.getWebsiteConfPath(websiteInfo.serverName);
        await fs.promises.writeFile(confPath, confText);

        //创建URL重写文件
        let rewritePath = Nginx.getWebsiteRewriteConfPath(websiteInfo.serverName);
        if(!await fsExists(rewritePath)){
            await fs.promises.writeFile(rewritePath,'');
        }
    }

    static async delWebsite(serverName) {
        let confPath = Nginx.getWebsiteConfPath(serverName);
        if (await fsExists(confPath)) {
            await fsDelete(confPath);
        }
        let rewritePath = Nginx.getWebsiteRewriteConfPath(serverName);
        if (await fsExists(rewritePath)) {
            await fsDelete(rewritePath);
        }
    }

    static async websiteExists(serverName) {
        let vhosts = await getFilesByDir(GetPath.getNginxVhostsPath(), '.conf');
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
     * @returns {Promise<Awaited<{name: *, text: String}>[]>}
     */
    static async getRewriteRuleList() {
        let rewritePath = GetPath.getNginxRewritePath();
        let files = await getFilesByDir(rewritePath);
        return files.map(name => {
            return getFilNameWithoutExt(name)
        });
    }

    static async getRewriteByRule(ruleName) {
        let rewritePath = path.join(GetPath.getNginxRewritePath(), `${ruleName}.conf`)
        if (!await fsExists(rewritePath)) {
            return '';
        }
        return await fs.promises.readFile(rewritePath, {encoding: 'utf8'});
    }

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