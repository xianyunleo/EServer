import fs from 'fs'
import {getCorePath} from "@/main/app";
import path from "path";

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
        newItem.Icon = path.join(softIconPath, item.Icon);
        newList.push(newItem);
    }
    console.log(list)
    console.log(newList)
    return newList;
}


export function getIconPath() {
    let corePath = getCorePath();
    let softPath = path.join(corePath, '/config/software');
    return path.join(softPath, '/icon');
}

export function getMysqlIconPath() {
    return path.join(getIconPath(),'mysql.png')
}