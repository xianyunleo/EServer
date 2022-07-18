import {getCorePath} from "@/main/app";
import path from "path";
import fs from "fs";

export function getIconPath() {
    let corePath = getCorePath();
    let softPath = path.join(corePath, '/config/software');
    return path.join(softPath, '/icon');
}

export function getList(type) {
    let corePath = getCorePath();
    let softPath = path.join(corePath, '/config/software');
    let softConfigPath = path.join(softPath, 'software.json');
    let softIconPath = path.join(softPath, '/icon');
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

//
// function getItemPath(item)
// {
//     let typePath = GetTypePath(item.Type);
//     return  typePath + item.DirName;
// }
//
// /// 根据软件类型，获取对应的软件所在的目录
// function GetTypePath( type)
// {
//     switch (type)
//     {
//         case PESoftwareClassEnum.Server:
//             return PathConst.ServerPath;
//
//         case PESoftwareClassEnum.PHP:
//             return PathConst.PhpDirPath;
//
//         case PESoftwareClassEnum.MySQL:
//             return PathConst.MySQLPath;
//
//         case PESoftwareClassEnum.Tool:
//             return PathConst.ToolPath;
//     }
//
//     return String.Empty;
// }

export function getDownloadsPath(){
    let corePath = getCorePath();
    return path.join(corePath, 'downloads');
}




