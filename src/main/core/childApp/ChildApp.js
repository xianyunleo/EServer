import path from 'path'
import {EnumChildAppType} from "@/shared/utils/enum";
import GetCorePath from "@/shared/utils/GetCorePath";
import GetDataPath from "@/shared/utils/GetDataPath";
import DirUtil from "@/main/utils/DirUtil";
import FileUtil from "@/main/utils/FileUtil";
import { parseTemplateStrings } from '@/shared/utils/utils'

export default class ChildApp {
    static #list;

    static async DirExists() {
        return await DirUtil.Exists(GetDataPath.getChildAppDir());
    }

    /**
     * 获取子应用列表
     * @returns {Promise<ChildAppItem[]>}
     */
    static async getList() {
        if (ChildApp.#list && ChildApp.#list.length > 0) {
            return ChildApp.#list
        }
        await this.initList()
        return ChildApp.#list
    }

    static async initList() {
        const appDir = path.join(GetCorePath.getDir(), '/config/childApp')
        const appConfigPath = path.join(appDir, 'childApp.json')
        const appIconDir = 'file://' + path.join(appDir, '/icon')

        let list
        try {
            list = JSON.parse(await FileUtil.ReadAll(appConfigPath))
            list = await Promise.all(list.map(async item => {
                const Icon = path.join(appIconDir, item.Icon)
                return { ...item, Icon }
            }))
        } catch {
            throw new Error(`${appConfigPath} 配置文件错误！`)
        }

        //自定义子应用配置
        const customAppDir = path.join(GetDataPath.getDir(), '/custom/childApp')
        const customAppConfigPath = path.join(customAppDir, 'childApp.json')
        const customAppIconDir = 'file://' + path.join(customAppDir, '/icon')

        let customList
        try {
            if (await FileUtil.Exists(customAppConfigPath)) {
                customList = JSON.parse(await FileUtil.ReadAll(customAppConfigPath))
                customList = await Promise.all(customList.map(async item => {
                    const Icon = path.join(customAppIconDir, item.Icon)
                    return { ...item, Icon }
                }))
            } else {
                customList = []
            }
        } catch {
            throw new Error(`${customAppConfigPath} 配置文件错误！`)
        }

        ChildApp.#list = list.concat(customList)
    }

    static async getItem(name) {
        return (await ChildApp.getList()).find((item) => item.Name === name)
    }

    static async getItemByDirName(dirName) {
        return (await ChildApp.getList()).find((item) => item.DirName === dirName)
    }

    /**
     * 判断子应用是否安装
     * @param item {ChildAppItem}
     * @returns {boolean}
     */
    static async IsInstalled(item) {
        let path = ChildApp.getDir(item);
        return await DirUtil.Exists(path);
    }

    /**
     * 获取子应用所在的目录
     * @param item {ChildAppItem}
     * @returns {string}
     */
    static getDir(item) {
        let typePath = ChildApp.getTypeDir(item.Type);
        return path.join(typePath, item.DirName);
    }

    /**
     * 获取子应用配置文件的路径
     * @param item {ChildAppItem}
     * @returns {string}
     */
    static getConfPath(item) {
        if (item.ConfPath == null) {
            throw new Error(`${item.Name} Conf Path 没有配置！`);
        }
        const etcDir = path.join(GetDataPath.getEtcDir(), item.DirName)
        const varMap = { EtcDir: etcDir}
        return path.normalize(parseTemplateStrings(item.ConfPath, varMap))
    }

    /**
     * 获取子应用Server配置文件的路径
     * @param item {ChildAppItem}
     * @returns {string}
     */
    static getServerConfPath(item) {
        if (item.ServerConfPath == null) {
            throw new Error(`${item.Name} Server Conf Path 没有配置！`);
        }
        const etcDir = path.join(GetDataPath.getEtcDir(), item.DirName)
        const varMap = { EtcDir: etcDir}
        return path.normalize(parseTemplateStrings(item.ServerConfPath, varMap))
    }

    /**
     * 获取子应用Server进程的路径
     * @param item {ChildAppItem}
     * @returns {string}
     */
    static getServerProcessPath(item) {
        if (item.ServerProcessPath == null) {
            throw new Error(`${item.Name} Server Process Path 没有配置！`);
        }
        const workDir = ChildApp.getDir(item);
        const varMap = { WorkDir: workDir}
        return path.normalize(parseTemplateStrings(item.ServerProcessPath, varMap))
    }

    /**
     * 根据子应用类型，获取子应用类型的目录
     * @param type {ChildAppItem.Type}
     * @returns {string}
     */
    static getTypeDir(type) {
        type = EnumChildAppType[type];
        switch (type) {
            case EnumChildAppType.PHP:
                return GetDataPath.getPhpTypeDir();
            case EnumChildAppType.Server:
                return GetDataPath.getServerTypeDir();
            case EnumChildAppType.Tool:
                return GetDataPath.getToolTypeDir();
            default:
                return '';
        }
    }

    static getIconPath() {
        let appPath = path.join(GetCorePath.getDir(), '/config/childApp');
        return path.join(appPath, '/icon');
    }

}
