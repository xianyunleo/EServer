import App from "@/main/App";
import path from "path";
import {enumGetName} from "@/shared/utils/utils";
import {EnumSoftwareType} from "@/shared/enum";
import GetPath from "@/shared/utils/GetPath";
import Directory from "@/main/utils/Directory";
import File from "@/main/utils/File";

export default class Software {

    static #list;

    /**
     *
     * @returns {[]}
     */
    static getList() {
        if(Software.#list){
            return Software.#list;
        }
        let corePath = App.getCorePath();
        let softPath = path.join(corePath, '/config/software');
        let softConfigPath = path.join(softPath, 'software.json');
        let softIconPath = 'file://' + path.join(softPath, '/icon');
        let json = File.ReadAllText(softConfigPath);
        let list = JSON.parse(json);

        for (const item of list) {
            item.Icon = path.join(softIconPath, item.Icon);
        }
        Software.#list = list;
        return list;
    }

    /**
     * 判断软件是否安装
     * @param item {SoftwareItem}
     * @returns {boolean}
     */
    static IsInstalled(item) {
        let path = Software.getPath(item);
        return Directory.Exists(path);
    }

    /**
     * 获取软件所在的目录
     * @param item {SoftwareItem}
     * @returns {string}
     */
    static getPath(item) {
        let typePath = Software.getTypePath(item.Type);
        return path.join(typePath, item.DirName);
    }

    /**
     * 获取软件服务配置文件所在的目录
     * @param item {SoftwareItem}
     * @returns {string}
     */
    static getServerConfPath(item) {
        let serverTypeName = enumGetName(EnumSoftwareType,EnumSoftwareType.Server);
        if (item.Type !== serverTypeName || !item.ServerConfPath) {
            return null;
        }
        let softPath = Software.getPath(item);
        return path.join(softPath, item.ServerConfPath);
    }

    /**
     * 获取软件服务进程绝对路径
     * @param item {SoftwareItem}
     * @returns {string}
     */
    static getServerProcessPath(item) {
        let workPath = Software.getPath(item); //服务目录
        return path.join(workPath, item.ServerProcessPath);  //服务的进程目录
    }


    /**
     * 根据软件类型，获取软件的类型目录
     * @param type {SoftwareItem.Type}
     * @returns {string}
     */
    static getTypePath(type) {
        type = EnumSoftwareType[type];
        switch (type) {
            case EnumSoftwareType.PHP:
                return GetPath.getPhpTypePath();
            case EnumSoftwareType.Server:
                return GetPath.getServerTypePath();
            case EnumSoftwareType.Tool:
                return GetPath.getToolTypePath();
            default:
                return '';
        }
    }

    static getIconPath() {
        let corePath = App.getCorePath();
        let softPath = path.join(corePath, '/config/software');
        return path.join(softPath, '/icon');
    }

}
