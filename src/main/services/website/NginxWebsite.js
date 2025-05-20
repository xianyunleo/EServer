import Nginx from "@/main/services/Nginx";
import {EOL} from "os";
import {CONF_INDENT} from "@/main/utils/constant";
import FileUtil from "@/main/utils/FileUtil";
import path from "path";
import GetDataPath from '@/shared/utils/GetDataPath'
import DirUtil from '@/main/utils/DirUtil'
import PathExt from '@/shared/utils/PathExt'

const N = EOL; //换行符
const T = CONF_INDENT; //缩进符

/**
 * 用去获取和设置Nginx站点配置
 */
export default class NginxWebsite {
    serverName;
    confName;
    confPath;
    confText;

    /**
     *
     * @param confName 配置文件名，带扩展名
     */
    constructor(confName) {
        this.confName = confName
    }

    async init() {
        this.serverName = PathExt.GetFileNameWithoutExt(this.confName).split('_')[0]
        this.confPath = Nginx.getWebsiteConfPath(this.confName)
        this.confText = await FileUtil.ReadAll(this.confPath)
    }

    getBasicInfo() {
        const extraInfo = this.getExtraInfo()
        return {
            confName: this.confName,
            serverName: this.serverName,
            extraServerName: this.getExtraServerName(),
            port: this.getPort(),
            rootPath: this.getRootPath(),
            phpVersion: this.getPHPVersion() ?? '',
            syncHosts: extraInfo?.syncHosts ?? false,
            note: extraInfo?.note ?? '',
        }
    }

    getExtraServerName() {
        const allServerName = Nginx.getAllServerName(this.confText)
        //目前只获取第二个域名
        return allServerName[1] ?? null
    }

    static async getRewrite(confName) {
        let rewritePath = Nginx.getWebsiteRewriteConfPath(confName);
        return await FileUtil.ReadAll(rewritePath);
    }

    getPort() {
        let matches = this.confText.match(/(?<=listen\s+)\d+(?=\s*;)/);
        return matches ? parseInt(matches[0]) : null;
    }

    getRootPath() {
        let matches = this.confText.match(/(?<=root\s+)\S+(?=\s*;)/);
        return matches ? matches[0] : null;
    }

    getPHPVersion() {
        let matches = this.confText.match(/php-(\S+?)\.conf/);
        return matches ? matches[1] : null;
    }

    getExtraInfo(key = null) {
        let matches = this.confText.match(/(?<=#EXTRA_INFO_START[\s\S]{0,9}#).*(?=[\s\S]{0,9}#EXTRA_INFO_END)/);
        if (!matches || !matches[0]) {
            return null;
        }
        let extraObj;
        try {
            extraObj = JSON.parse(matches[0]) ?? {};
        } catch {
            return null;
        }

        return key ? extraObj[key] : extraObj;
    }

    async setBasicInfo(websiteInfo) {
        let text = this.confText;
        let serverNameStr;
        let extraServerName = websiteInfo.extraServerName
        if (extraServerName) {
            if (extraServerName !== this.getExtraServerName())
                if (await Nginx.websiteExists(extraServerName, websiteInfo.port)) {
                    throw new Error(`${extraServerName}:${websiteInfo.port}\n已经存在，不能重复！`)
                }
            serverNameStr = `server_name ${this.serverName} ${extraServerName};`
        } else {
            serverNameStr = `server_name ${this.serverName};`;
        }
        text = text.replace(/server_name\s+[^\s;]+\s*(.+)?\s*;/, serverNameStr);
        text = text.replace(/(?<=listen\s+)\d+(?=\s*;)/, websiteInfo.port);
        text = text.replace(/(?<=root\s+)\S+(?=\s*;)/, websiteInfo.rootPath);
        this.confText = text;
        this.setPHPVersion(websiteInfo.phpVersion);
        this.setExtraInfo({ syncHosts: websiteInfo.syncHosts, note: websiteInfo.note });
        await FileUtil.WriteAll(this.confPath, this.confText);
    }

    async setSsl(sslInfo) {
        let text = this.confText
        //证书目录，不需要区分端口，只需要区分域名
        const sslDir = GetDataPath.getNginxVhostsSslDir(this.serverName);
        if(!await DirUtil.Exists(sslDir)) DirUtil.Create(sslDir)

        const keyName = path.basename(sslInfo.keyPath)
        const keyPath = path.join(sslDir,keyName).replaceSlash()
        await FileUtil.Copy(sslInfo.keyPath,keyPath)

        const certName = path.basename(sslInfo.certPath)
        const certPath = path.join(sslDir, certName).replaceSlash()
        await FileUtil.Copy(sslInfo.certPath, certPath)

        //增加listen 443，注意listen后面还有可能有 “default_server” 关键字
        const listenPattern = /(?<=listen.*;)[\s\S]+?(?=server_name)/;
        text = text.replace(listenPattern, `${N}${T}listen ${sslInfo.port} ssl;${N}${T}`);

        const toHttpsPattern = /(?<=#HTTP_TO_HTTPS_START)[\s\S]+?(?=#HTTP_TO_HTTPS_END)/;
        if (sslInfo.isForceHttps)
        {
            //插入重定向到https的配置
            const toHttpsText = Nginx.getToHttpsConfText(sslInfo.port);
            text = text.replace(toHttpsPattern, `${N}${toHttpsText}${N}${T}`)
        }
        else
        {
            //删除重定向到https的配置
            text = text.replace(toHttpsPattern, `${N}${T}`)
        }

        //插入ssl配置
        const httpsConf = Nginx.getSslConfText(certPath,keyPath)
        const sslPattern = /(?<=#SSL_START)[\s\S]+?(?=#SSL_END)/
        text = text.replace(sslPattern, `${N}${httpsConf}${N}${T}`)
        this.confText = text;
    }

    async closeSsl(){
        let text = this.confText
        const listenPattern = /.*listen\s+\d+\s+ssl\d*;\r?\n/
        text = text.replace(listenPattern, '')

        const toHttpsPattern = /(?<=#HTTP_TO_HTTPS_START)[\s\S]+?(?=#HTTP_TO_HTTPS_END)/
        text = text.replace(toHttpsPattern, `${N}${T}`)
        const httpsPattern = /(?<=#SSL_START)[\s\S]+?(?=#SSL_END)/
        text = text.replace(httpsPattern, `${N}${T}`)

        this.confText = text
    }


    async getSslInfo() {
        const text = this.confText
        const portPattern = /listen\s+(\d+)\s+ssl;/
        const portMatch = text.match(portPattern)
        const certPattern = /ssl_certificate\s+(.+);/
        const certMatch = text.match(certPattern)
        const keyPattern = /ssl_certificate_key\s+(.+);/
        const keyMatch = text.match(keyPattern)
        const toHttpsPattern = /#HTTP_TO_HTTPS_START([\s\S]+?)#HTTP_TO_HTTPS_END/
        const toHttpsMatch = text.match(toHttpsPattern)
        return {
            port: portMatch ? parseInt(portMatch[1]) : null,
            certPath: certMatch ? certMatch[1] : null,
            keyPath: keyMatch ? keyMatch[1] : null,
            isForceHttps: !!(toHttpsMatch && toHttpsMatch[1].trim())
        }
    }

    static async saveRewrite(confName, content) {
        let rewritePath = Nginx.getWebsiteRewriteConfPath(confName);
        await FileUtil.WriteAll(rewritePath, content);
    }

    /**
     * 替换配置文件中的PHP版本
     * @param  phpVersion {string}
     */
     setPHPVersion(phpVersion) {
        let phpPattern = /(?<=#PHP_START)[\s\S]+?(?=#PHP_END)/;
        let phpReplace;
        if (phpVersion) {
            phpReplace = `${N}${T}include php/php-${phpVersion}.conf;${N}${T}`;
        } else {
            phpReplace = `${N}${T}`;
        }
        this.confText  = this.confText.replace(phpPattern, phpReplace);
    }

    setExtraInfo(obj) {
        let extraObj = this.getExtraInfo() ?? {};
        Object.assign(extraObj, obj);
        let extraStr = JSON.stringify(extraObj);
        this.confText = this.confText.replace(/(?<=#EXTRA_INFO_START[\s\S]{0,9}#).*(?=[\s\S]{0,9}#EXTRA_INFO_END)/, extraStr);
    }

    async save() {
        await FileUtil.WriteAll(this.confPath, this.confText);
    }
}
