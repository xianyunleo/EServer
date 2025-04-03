import path from 'path'
import FileUtil from "@/main/utils/FileUtil";
import GetDataPath from '@/shared/utils/GetDataPath'
import { isRealServer } from '@/shared/utils/childApp'


/**
 * 自定义子应用，非应用商店里的，在 软件数据目录/custom/childApp目录里定义
 */
export default class CustomChildApp {
    static #list

    /**
     * 获取自定义子应用列表
     * @returns {Promise<ChildAppItem[]>}
     */
    static async getList() {
        if (CustomChildApp.#list && CustomChildApp.#list.length > 0) {
            return CustomChildApp.#list
        }
        await this.initList()
        return CustomChildApp.#list
    }

    static async initList() {
        //自定义子应用配置
        const customAppDir = path.join(GetDataPath.getDir(), '/custom/childApp')
        const configPath = path.join(customAppDir, 'childApp.json')

        let list
        try {
            if (await FileUtil.Exists(configPath)) {
                list = JSON.parse(await FileUtil.ReadAll(configPath))
            } else {
                list = []
            }
        } catch {
            throw new Error(`${configPath} 配置文件错误！`)
        }
        CustomChildApp.#list = list
    }

    static async add(newItem) {
        CustomChildApp.#list.push(newItem)
        const configPath = CustomChildApp.getConfigPath()
        await FileUtil.WriteAll(configPath, JSON.stringify(CustomChildApp.#list, null, 4))
    }

    static async modify(name, newItem) {
        for (const item of CustomChildApp.#list) {
            if (item.Name === name) {
                Object.assign(item, newItem)
            }
        }
        const configPath = CustomChildApp.getConfigPath()
        await FileUtil.WriteAll(configPath, JSON.stringify(CustomChildApp.#list, null, 4))
    }

    static async del(name) {
        const list = CustomChildApp.#list.filter(item => item.Name !== name)
        const configPath = CustomChildApp.getConfigPath()
        await FileUtil.WriteAll(configPath, JSON.stringify(list, null, 4))
        CustomChildApp.#list = list;
    }

    static getConfigPath(){
        return path.join(path.join(GetDataPath.getDir(), '/custom/childApp'), 'childApp.json')
    }


    static getServerProcessPathList() {
        const list = []
        for (const item of CustomChildApp.#list) {
            if (isRealServer(item.Type)) {
                list.push(path.normalize(item.ServerProcessPath))
            }
        }
        return list
    }

}
