import path from "path";
import GetPath from "@/shared/utils/GetPath";
import NginxWebsite from "@/main/core/website/NginxWebsite";
import Directory from "@/main/utils/Directory";
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


        FileUtil.WriteAllText(confPath, confText);

        let website = new NginxWebsite(confName);
        website.setPHPVersion(websiteInfo.phpVersion);
        website.setExtraInfo({syncHosts: websiteInfo.syncHosts});
        website.save();

        //创建URL重写文件
        let rewritePath = Nginx.getWebsiteRewriteConfPath(confName);
        if (!FileUtil.Exists(rewritePath)) {
            FileUtil.WriteAllText(rewritePath, '');
        }
    }

    static delWebsite(confName) {
        let confPath = this.getWebsiteConfPath(confName);
        if (FileUtil.Exists(confPath)) {
            FileUtil.Delete(confPath);
        }

        let rewritePath = this.getWebsiteRewriteConfPath(confName);
        if (FileUtil.Exists(rewritePath)) {
            FileUtil.Delete(rewritePath);
        }
    }

    static async websiteExists(serverName, port) {
        const vhostsPath = GetPath.getNginxVhostsDir()
        const files = Directory.GetFiles(vhostsPath)
        const filterArr = await files.filterAsync(async (path) => {
            let confText = FileUtil.ReadAllText(path)
            let regExp = new RegExp('server_name.+' + serverName.replaceAll('.', '\\.'))
            return regExp.test(confText) && this.getPortByConfPath(path) === port
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

    /**
     * 获取URL重写规则列表
     * @returns {Promise<string[]>}
     */
    static getRewriteRuleList() {
        let rewritePath = GetPath.getNginxRewriteDir();
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
        let rewritePath = path.join(GetPath.getNginxRewriteDir(), `${ruleName}.conf`)
        if (!FileUtil.Exists(rewritePath)) {
            return '';
        }
        return FileUtil.ReadAllText(rewritePath);
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
