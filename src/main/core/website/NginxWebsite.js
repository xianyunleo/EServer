import Nginx from "@/main/core/Nginx";
import {STATIC_WEB_NAME} from "@/shared/constant";
import {EOL} from "os";
import {CONF_INDENT} from "@/main/constant";
import File from "@/main/utils/File";
import Path from "@/main/utils/Path";

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
        this.confName = confName;
        this.serverName = Path.GetFileNameWithoutExtension(confName).split('_')[0];
        this.confPath = Nginx.getWebsiteConfPath(confName);
        this.confText = File.ReadAllText(this.confPath);
    }

    getBasicInfo() {
        return {
            confName: this.confName,
            serverName: this.serverName,
            extraServerName: this.getExtraServerName(),
            port: this.getPort(),
            rootPath: this.getRootPath(),
            phpVersion: this.getPHPVersion() ?? STATIC_WEB_NAME,
            allowSyncHosts: this.getExtraInfo('allowSyncHosts') ?? false,
        }
    }

    getExtraServerName(){
        let matches = this.confText.match(/server_name\s+[^\s;]+\s*(.+)?\s*;/);
        return matches ? matches[1] : null;
    }

    static getRewrite(confName) {
        let rewritePath = Nginx.getWebsiteRewriteConfPath(confName);
        return File.ReadAllText(rewritePath);
    }

    getPort() {
        let matches = this.confText.match(/(?<=listen\s+)\d+(?=\s*;)/);
        return matches ? matches[0] : null;
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

    setBasicInfo(websiteInfo) {
        let text = this.confText;
        let serverNameStr;
        if (websiteInfo.extraServerName) {
            serverNameStr = `server_name ${this.serverName} ${websiteInfo.extraServerName};`;
        } else {
            serverNameStr = `server_name ${this.serverName};`;
        }
        text = text.replace(/server_name\s+[^\s;]+\s*(.+)?\s*;/, serverNameStr);
        text = text.replace(/(?<=listen\s+)\d+(?=\s*;)/, websiteInfo.port);
        text = text.replace(/(?<=root\s+)\S+(?=\s*;)/, websiteInfo.rootPath);
        this.confText = text;
        this.setPHPVersion(websiteInfo.phpVersion);
        this.setExtraInfo({allowSyncHosts: websiteInfo.allowSyncHosts});
        File.WriteAllText(this.confPath, this.confText);
    }

    static saveRewrite(confName, content) {
        let rewritePath = Nginx.getWebsiteRewriteConfPath(confName);
        File.WriteAllText(rewritePath, content);
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

    save() {
        File.WriteAllText(this.confPath, this.confText);
    }
}
