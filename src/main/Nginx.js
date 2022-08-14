import {EOL} from "os";
import {CONF_INDENT} from "@/main/constant";
import path from "path";
import {getNginxVhostsPath} from "@/main/getPath";
import fs from "fs";
import {dirGetFiles, getFilNameWithoutExt} from "@/main/utils";
import NginxWebsite from "@/main/NginxWebsite";

export default class Nginx {

    static async getWebsiteList(search) {
        let list = await dirGetFiles(getNginxVhostsPath(), search);
        return await Promise.all(list.map(async item => {
            let serverName = getFilNameWithoutExt(item);
            let webSite = new NginxWebsite(serverName);
            await webSite.init();
            return webSite.getBasicConf();
        }));
    }

    static async addWebsite(webServerInfo) {
        let confText =
            `server
{
    listen ${webServerInfo.port};
    server_name ${webServerInfo.serverName};
    index index.html index.htm index.php;
    root  ${webServerInfo.path};

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
    #REWRITE_END

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

    access_log  logs/${webServerInfo.serverName}.access.log;
    error_log  logs/${webServerInfo.serverName}.error.log;
}`;
        if (webServerInfo.phpVersion) {
            let phpPattern = /(?<=#PHP_START)[\s\S]+?(?=#PHP_END)/;
            let phpReplace = `${EOL}${CONF_INDENT}include php-${webServerInfo.phpVersion}.conf;${EOL}${CONF_INDENT}`;
            confText = confText.replace(phpPattern, phpReplace)
        }

        let confPath = path.join(getNginxVhostsPath(), `${webServerInfo.serverName}.conf`)
        await fs.promises.writeFile(confPath, confText);
    }

    static async delWebsite(serverName) {
        let confPath = Nginx.getWebsiteConfPath(serverName);
        await fs.promises.unlink(confPath);
    }

    static async websiteIsExist(serverName) {
        let vhosts = await dirGetFiles(getNginxVhostsPath(), '.conf');
        return vhosts.includes(`${serverName}.conf`)
    }

    static getWebsiteConfPath(serverName) {
        return path.join(getNginxVhostsPath(), `${serverName}.conf`);
    }
}