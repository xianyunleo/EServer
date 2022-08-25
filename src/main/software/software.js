import App from "@/main/App";
import path from "path";
import fs from "fs";
import {enumGetName, fsExistsSync} from "@/main/utils";
import {EnumSoftwareType} from "@/main/enum";
import GetPath from "@/main/GetPath";

export default class Software {

    /**
     *
     * @returns {[]}
     */
    static getList() {
        //TODO 配置写到内存里
        let corePath = App.getUserCorePath();
        let softPath = path.join(corePath, '/config/software');
        let softConfigPath = path.join(softPath, 'software.json');
        let softIconPath = 'file://' + path.join(softPath, '/icon');
        let json = fs.readFileSync(softConfigPath);
        let list = JSON.parse(json);

        for (const item of list) {
            item.Icon = path.join(softIconPath, item.Icon);
        }
        return list;
    }

    /**
     * 判断软件是否安装
     * @param item {SoftwareItem}
     * @returns {Promise<|undefined>}
     * @constructor
     */
    static IsInStalled(item) {
        let path = Software.getPath(item);
        return fsExistsSync(path);
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
     * 根据软件类型，获取软件所在的类型目录
     * @param type {SoftwareItem.Type}
     * @returns {string}
     */
    static getTypePath(type) {
        type = EnumSoftwareType[type];
        switch (type) {
            case EnumSoftwareType.PHP:
                return GetPath.getPHPPath();
            case EnumSoftwareType.Server:
                return GetPath.getServerPath();
            case EnumSoftwareType.MySQL:
                return GetPath.getServerPath();
            default:
                return '';
        }
    }

    static getIconPath() {
        let corePath = App.getUserCorePath();
        let softPath = path.join(corePath, '/config/software');
        return path.join(softPath, '/icon');
    }

}