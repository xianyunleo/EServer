import path from "path";
import GetPath from "@/shared/utils/GetPath";
import NginxWebsite from "@/main/core/website/NginxWebsite";
import DirUtil from "@/main/utils/DirUtil";
import FileUtil from "@/main/utils/FileUtil";
import Path from "@/main/utils/Path";
import { isWindows } from '@/main/utils/utils'

export default class Nginx {
    /**
     * 获取网站列表
     * @param search {string}
     * @returns {Promise<string[]>}
     */
    static async getWebsiteList(search) {
        let vhostsPath = GetPath.getNginxVhostsDir();
        if (!await DirUtil.Exists(vhostsPath)) {
            return [];
        }

        const files = await DirUtil.GetFiles(vhostsPath, search, true)
        //根据创建时间倒序
        files.sort((a,b)=>{
            return b.stats.birthtimeMs - a.stats.birthtimeMs
        })

        const mapFn = async (file) => {
            let confName = Path.GetBaseName(file.path)
            const website = new NginxWebsite(confName)
            await website.init()
            return website.getBasicInfo()
        }

        return await Promise.all(files.map(mapFn))
    }

    /**
     * 添加网站
     * @param websiteInfo {WebsiteItem}
     */
    static async addWebsite(websiteInfo) {
        let serverName = websiteInfo.serverName;
        let serverNameStr = websiteInfo.extraServerName ? `${serverName} ${websiteInfo.extraServerName}` : serverName;
        let confName = this.getWebsiteConfName(websiteInfo.serverName, websiteInfo.port);
        let confPath = this.getWebsiteConfPath(confName);
        let errorLogOffValue = this.getErrorLogOffValue();
        let confText =
            `server
{
    listen ${websiteInfo.port};
    server_name ${serverNameStr};
    index index.html index.htm index.php;
    root  ${websiteInfo.rootPath};

    autoindex off;

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

    #禁止访问的文件或目录
    location ~ ^/(\\.user.ini|\\.htaccess|\\.git|\\.env|\\.svn|\\.project|LICENSE|README.md)
    {
        return 404;
    }

    location ~ .+\\.(gif|jpg|jpeg|png|bmp|swf)$
    {
        expires      1d;
        error_log ${errorLogOffValue};
        access_log off;
    }

    location ~ .+\\.(js|css)$
    {
        expires      1h;
        error_log ${errorLogOffValue};
        access_log off;
    }

    location = /favicon.ico {
        log_not_found off;
        access_log off;
    }

    access_log  logs/${Path.GetFileNameWithoutExtension(confName)}.access.log;
    error_log  logs/${Path.GetFileNameWithoutExtension(confName)}.error.log;
}`;

        if (isWindows) {
            confText = confText.replaceAll("\n", "\r\n");
        }


        await FileUtil.WriteAll(confPath, confText);

        const website = new NginxWebsite(confName);
        await website.init();
        website.setPHPVersion(websiteInfo.phpVersion);
        website.setExtraInfo({ syncHosts: websiteInfo.syncHosts });
        await website.save();

        //创建URL重写文件
        let rewritePath = Nginx.getWebsiteRewriteConfPath(confName);
        if (!await FileUtil.Exists(rewritePath)) {
            await FileUtil.WriteAll(rewritePath, '');
        }
    }

    static async delWebsite(confName) {
        let confPath = this.getWebsiteConfPath(confName);
        if (await FileUtil.Exists(confPath)) {
            await FileUtil.Delete(confPath);
        }

        let rewritePath = this.getWebsiteRewriteConfPath(confName);
        if (await FileUtil.Exists(rewritePath)) {
            await FileUtil.Delete(rewritePath);
        }
    }



    static async websiteExists(serverName, port) {
        const vhostsPath = GetPath.getNginxVhostsDir()
        const files = await DirUtil.GetFiles(vhostsPath)
        const filterArr = await files.filterAsync(async (path) => {
            let confText = await FileUtil.ReadAll(path)
            const serverNames = this.getAllServerName(confText)
            return serverNames.includes(serverName) && this.getPortByConfPath(path) === port
        })
        return filterArr.length > 0
    }

    static getWebsiteConfPath(confName) {
        return path.join(GetPath.getNginxVhostsDir(), confName);
    }

    static getWebsiteConfName(serverName, port) {
        return `${serverName}_${port}.conf`;
    }

    static getWebsiteRewriteConfPath(confName) {
        return path.join(GetPath.getNginxVhostsRewriteDir(), confName);
    }

    static getAllServerName(text) {
        const matches = text.match(/server_name\s+(.+);/)
        if (matches) {
            const groupStr = matches[1]
            return groupStr.trim().split(/\s+/)
        } else {
            return []
        }
    }

    /**
     * 获取URL重写规则列表
     * @returns {Promise<string[]>}
     */
    static async getRewriteRuleList() {
        let rewritePath = GetPath.getNginxRewriteDir();
        if (!await DirUtil.Exists(rewritePath)) {
            return [];
        }
        let files = await DirUtil.GetFiles(rewritePath, '.conf');
        return files.map(name => {
            return Path.GetFileNameWithoutExtension(name);
        });
    }

    /**
     * 获取URL重写规则内容
     * @param ruleName {string}
     * @returns {string}
     */
    static async getRewriteByRule(ruleName) {
        let rewritePath = path.join(GetPath.getNginxRewriteDir(), `${ruleName}.conf`)
        if (!await FileUtil.Exists(rewritePath)) {
            return '';
        }
        return await FileUtil.ReadAll(rewritePath);
    }

    /**
     * 获取端口号，根据配置文件路径名
     * @param path
     * @returns {number}
     */
    static getPortByConfPath(path){
        return Number(Path.GetFileNameWithoutExtension(path).split('_')[1])
    }

    static getErrorLogOffValue(){
        return isWindows ? 'nul' : '/dev/null';
    }
}
