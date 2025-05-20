import nodePath from 'path'
import GetDataPath from "@/shared/utils/GetDataPath";
import NginxWebsite from "@/main/services/website/NginxWebsite";
import DirUtil from "@/main/utils/DirUtil";
import FileUtil from "@/main/utils/FileUtil";
import { isWindows, replaceLineBreak } from '@/main/utils/utils'
import { EOL } from 'os'
import { CONF_INDENT } from '@/main/utils/constant'
import PathExt from '@/shared/utils/PathExt'

const N = EOL; //换行符
const T = CONF_INDENT; //缩进符

export default class Nginx {
    /**
     * 获取网站列表
     * @param search {string}
     * @returns {Promise<string[]>}
     */
    static async getWebsiteList(search = '') {
        let vhostsPath = GetDataPath.getNginxVhostsDir()
        if (!await DirUtil.Exists(vhostsPath)) {
            return [];
        }

        const searchRegx = new RegExp(`.*${search}.*\\.conf$`, 'i')

        const files = await DirUtil.GetFiles(vhostsPath, searchRegx, true)
        //根据创建时间倒序
        files.sort((a,b)=>{
            return b.stats.birthtimeMs - a.stats.birthtimeMs
        })

        const mapFn = async (file) => {
            let confName = nodePath.basename(file.path)
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

    access_log  logs/${PathExt.GetFileNameWithoutExt(confName)}.access.log;
    error_log  logs/${PathExt.GetFileNameWithoutExt(confName)}.error.log;
}`;

        confText = replaceLineBreak(confText)

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

    static async websiteExists(serverName, port = null) {
        const vhostsPath = GetDataPath.getNginxVhostsDir()
        const files = await DirUtil.GetFiles(vhostsPath)
        const filterFn = async (path) => {
            const confText = await FileUtil.ReadAll(path)
            const serverNames = this.getAllServerName(confText)
            if (serverNames.includes(serverName)) {
                if (port != null) {
                    return this.getPortByConfPath(path) === port
                }
                return true
            }
            return false
        }
        const filterArr = await files.filterAsync(filterFn)
        return filterArr.length > 0
    }

    static getWebsiteConfPath(confName) {
        return nodePath.join(GetDataPath.getNginxVhostsDir(), confName)
    }

    static getWebsiteConfName(serverName, port) {
        return `${serverName}_${port}.conf`;
    }

    static getWebsiteRewriteConfPath(confName) {
        return nodePath.join(GetDataPath.getNginxVhostsRewriteDir(), confName)
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
        let rewritePath = GetDataPath.getNginxRewriteDir()
        if (!await DirUtil.Exists(rewritePath)) {
            return [];
        }
        let files = await DirUtil.GetFiles(rewritePath, '.conf');
        return files.map(name => {
            return PathExt.GetFileNameWithoutExt(name)
        });
    }

    /**
     * 获取URL重写规则内容
     * @param ruleName {string}
     * @returns {string}
     */
    static async getRewriteByRule(ruleName) {
        let rewritePath = nodePath.join(GetDataPath.getNginxRewriteDir(), `${ruleName}.conf`)
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
        return Number(PathExt.GetFileNameWithoutExt(path).split('_')[1])
    }

    static getErrorLogOffValue(){
        return isWindows ? 'nul' : '/dev/null';
    }

    static getSslConfText(certPath, ketPath) {
        const text = `${T}ssl_certificate ${certPath};
${T}ssl_certificate_key ${ketPath};
${T}ssl_protocols TLSv1.1 TLSv1.2 TLSv1.3;
${T}ssl_prefer_server_ciphers on;`

        return replaceLineBreak(text)
    }

    /**
     *
     * @param sslPort {number}
     * @returns {*}
     */
    static getToHttpsConfText(sslPort) {
        const text = `${T}if ($scheme != https){
${T}${T}return 301 https://$host:${sslPort}$request_uri;
${T}}`

        return replaceLineBreak(text)
    }
}
