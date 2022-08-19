import {getUserCorePath} from "@/main/app";
import path from "path";
import fs from "fs";
import {SoftwareType} from "@/main/enum";
import {getPHPPath, getServerPath} from "@/main/getPath";
import {fsExistsSync} from "@/main/utils";

export function getIconPath() {
    let corePath = getUserCorePath();
    let softPath = path.join(corePath, '/config/software');
    return path.join(softPath, '/icon');
}

export  function getList(type) {
    let corePath = getUserCorePath();
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
        newItem.Installed = IsInStalled(item);
        newItem.Icon = path.join(softIconPath, item.Icon);
        newList.push(newItem);
    }
    console.log('newList',newList)
    return newList;
}

/**
 * 判断软件是否安装
 * @param item
 * @returns {Promise<|undefined>}
 * @constructor
 */
 function IsInStalled(item) {
    let path = getPath(item);
    return fsExistsSync(path);
}

/**
 * 获取软件所在的目录
 * @param item
 * @returns {string}
 */
export function getPath(item) {
    console.log('getPath',item)
    let typePath = getTypePath(item.Type);
    return path.join(typePath, item.DirName);
}

/**
 * 根据软件类型，获取软件所在的类型目录
 * @param type
 * @returns {string}
 */
function getTypePath(type) {
    type = SoftwareType[type];
    switch (type) {
        case SoftwareType.PHP:
            return getPHPPath();
        case SoftwareType.Server:
            return getServerPath();
        case SoftwareType.MySQL:
            return getServerPath();
        default:
            return '';
    }
}








