import {getCorePath} from "@/main/app";
import path from "path";
import fs from "fs";
import {SoftwareType} from "@/main/enum";
import {getPhpPath} from "@/main/path";

export function getIconPath() {
    let corePath = getCorePath();
    let softPath = path.join(corePath, '/config/software');
    return path.join(softPath, '/icon');
}

export function getList(type) {
    let corePath = getCorePath();
    let softPath = path.join(corePath, '/config/software');
    let softConfigPath = path.join(softPath, 'software.json');
    let softIconPath = 'file://'+path.join(softPath, '/icon');
    let json = fs.readFileSync(softConfigPath);
    let list = JSON.parse(json);

    let newList =  [];
    for (const item of list) {
        if (type && type !== item.Type) {
            continue;
        }
        let newItem = item;
        newItem.IsInstall = true;
        newItem.Icon = path.join(softIconPath, item.Icon);
        newList.push(newItem);
    }
    return newList;
}

// function IsInStalled() {
//     let itemPath = GetSoftwarePath(software);
//
//     if (Directory.Exists(softwarePath))
//     {
//         return true;
//     }
//     return false;
// }


//获取软件所在的目录
// eslint-disable-next-line no-unused-vars
export function getItemPath(item) {
    let typePath = getTypePath(item.Type);
    return path.join(typePath, item.DirName);
}

//根据软件类型，获取软件所在的类型目录
export function getTypePath(type) {
    type = SoftwareType[type];
    console.log('SoftwareType',type)
    switch (type) {
        case SoftwareType.PHP:
            return getPhpPath();
        default:
            return '';
    }
}








