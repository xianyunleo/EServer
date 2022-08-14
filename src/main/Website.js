import fs from "fs";
import path from "path";
import {EOL} from "os";
import {getNginxVhostsPath, getPHPPath} from "@/main/getPath";
import {dirGetDirs, dirGetFiles, fileExists, getFilNameWithoutExt} from "@/main/utils";
import {CONF_INDENT, STATIC_WEB_NAME} from "@/main/constant";
import NginxWebsite from "@/main/NginxWebsite";

export default class Website {
    static async add(webServerInfo) {
        if(await this.isExist(webServerInfo.serverName)){
            throw new Error('添加失败，网站已经存在！');
        }
        if (!await fileExists(webServerInfo.path)) {
            try{
                !await fs.promises.mkdir(webServerInfo.path)
            }catch {
                throw new Error('添加失败，创建根目录失败！');
            }
        }

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

        if(webServerInfo.phpVersion){
            let phpPattern = /(?<=#PHP_START)[\s\S]+?(?=#PHP_END)/;
            let phpReplace = `${EOL}${CONF_INDENT}include php-${webServerInfo.phpVersion}.conf;${EOL}${CONF_INDENT}`;
            confText = confText.replace(phpPattern,phpReplace)
        }

        let confPath = path.join(getNginxVhostsPath(),`${webServerInfo.serverName}.conf`)
        await fs.promises.writeFile(confPath,confText);
    }

    static async isExist(serverName) {
        let vhosts = await dirGetFiles(getNginxVhostsPath(), '.conf');
        return vhosts.includes(`${serverName}.conf`)
    }

    static async getList(search){
        let list = await dirGetFiles(getNginxVhostsPath(),search);
        return await Promise.all(list.map(async item => {
            let serverName = getFilNameWithoutExt(item);
            let webSite = new NginxWebsite(serverName);
            await webSite.init();
            return {
                serverName: serverName,
                port: webSite.getPort(),
                path: webSite.getPath(),
                phpVersion: webSite.getPHPVersion() ?? STATIC_WEB_NAME ,
                confPath:webSite.getConfPath(),
            }
        }));
    }

    static async getPHPVersionList(){
        let list = await dirGetDirs(getPHPPath(),'php-');
        let res =  list.map(item =>{
            let matches = item.match(/php-(.+)/);
            if(!matches){
                return false;
            }
            return {version:matches[1],name:matches[0]};
        });
        res.push({version:'',name:STATIC_WEB_NAME});
        return res;
    }


}