import path from 'path'
import FileUtil from "@/main/utils/FileUtil";
import GetDataPath from '@/shared/utils/GetDataPath'


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
        const customAppConfigPath = path.join(customAppDir, 'childApp.json')

        let list
        try {
            if (await FileUtil.Exists(customAppConfigPath)) {
                list = JSON.parse(await FileUtil.ReadAll(customAppConfigPath))
            } else {
                list = []
            }
        } catch {
            throw new Error(`${customAppConfigPath} 配置文件错误！`)
        }
        list = list.map(item => ({ ...item, IsCustom: true }))
        CustomChildApp.#list = list
    }

}
