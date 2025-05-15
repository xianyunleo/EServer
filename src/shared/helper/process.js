import FsUtil from '@/main/utils/FsUtil'
import path from 'path'
import ChildApp from '@/main/services/childApp/ChildApp'
import CustomChildApp from '@/main/services/childApp/CustomChildApp'
import GetDataPath from '@/shared/utils/GetDataPath'
import { isWindows } from '@/main/utils/utils'
import ProcessExtend from '@/main/utils/ProcessExtend'

export async function getProcessList(winFunc) {
    let list
    let pathList = CustomChildApp.getServerProcessPathList()
    pathList = await Promise.all(pathList.map(async (p) => await FsUtil.ParseSymbolicLink(p)))
    const options = { directory: GetDataPath.getChildAppDir(), pathList }
    if (isWindows) {
        list = await winFunc(options)
    } else {
        list = await ProcessExtend.getList(options)
    }
    return list
}

/**
 *
 * @param serverList {array|object}
 * @param processList {array}
 * @param isVue
 * @returns {Promise<Awaited<unknown>[]>}
 */
export async function initServerListStatus(serverList, processList, isVue = false) {
    processList = processList.map((item) => [item.path, item.pid])
    const processMap = new Map(processList)
    const initServerStatus = async (item) => {
        const servPath = item.IsCustom ? await FsUtil.ParseSymbolicLink(path.normalize(item.ServerProcessPath)) : ChildApp.getServerProcessPath(item)
        const pid = processMap.get(servPath)
        item.isRunning = !!pid
        item.pid = pid ?? null
        return item
    }

    const realList = isVue ? serverList.value : serverList
    const promiseArray = realList.map((item) => initServerStatus(item))
    return await Promise.all(promiseArray)
}
