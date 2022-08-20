import App from "@/main/App";
import path from "path";
import fs from "fs";
import {fsExistsSync} from "@/main/utils";
import {SoftwareType} from "@/main/enum";
import GetPath from "@/main/GetPath";

export default class Software {

    static getIconPath() {
        let corePath = App.getUserCorePath();
        let softPath = path.join(corePath, '/config/software');
        return path.join(softPath, '/icon');
    }

    /**
     *
     * @param type {SoftwareItem.Type}
     * @returns {[]}
     */
    static getList(type) {
        let corePath = App.getUserCorePath();
        let softPath = path.join(corePath, '/config/software');
        let softConfigPath = path.join(softPath, 'software.json');
        let softIconPath = 'file://' + path.join(softPath, '/icon');
        let json = fs.readFileSync(softConfigPath);
        let list = JSON.parse(json);

        let newList = [];
        for (const item of list) {
            if (type && type !== item.Type) {
                continue;
            }
            let newItem = item;
            newItem.Installed = Software.IsInStalled(item);
            newItem.Icon = path.join(softIconPath, item.Icon);
            newList.push(newItem);
        }
        return newList;
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
     * 根据软件类型，获取软件所在的类型目录
     * @param type {SoftwareItem.Type}
     * @returns {string}
     */
    static getTypePath(type) {
        type = SoftwareType[type];
        switch (type) {
            case SoftwareType.PHP:
                return GetPath.getPHPPath();
            case SoftwareType.Server:
                return GetPath.getServerPath();
            case SoftwareType.MySQL:
                return GetPath.getServerPath();
            default:
                return '';
        }
    }
}