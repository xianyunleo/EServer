import FsUtil from '@/main/utils/FsUtil'
import path from 'path'
import ChildApp from '@/main/services/childApp/ChildApp'
import CustomChildApp from '@/main/services/childApp/CustomChildApp'
import GetDataPath from '@/shared/helpers/GetDataPath'
import { isWindows } from '@/shared/utils/utils2'
import ProcessExtend from '@/main/utils/ProcessExtend'
import { EnumServerStatusCheckMode } from '@/shared/helpers/enum'

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
 * @param runningProcessList {array}
 * @param tcpProcessList {array}
 * @param isVue
 * @returns {Promise<Awaited<unknown>[]>}
 */
export async function initServerListStatus(serverList, runningProcessList, tcpProcessList, isVue = false) {
    const runningProcessMap = new Map()
    for (const runningProcess of runningProcessList) {
        const key = runningProcess.path;
        let existItem = runningProcessMap.get(key)
        if (!existItem) {
            existItem = []
        }
        existItem.push(runningProcess.pid)
        runningProcessMap.set(key, existItem)
    }

    const tcpProcessData = tcpProcessList ? tcpProcessList.map(item => [item.pid, item.port]) : [];
    const tcpProcessMap = new Map(tcpProcessData)

    const initServerStatus = async (item) => {
        const servPath = item.IsCustom ? await FsUtil.ParseSymbolicLink(path.normalize(item.ServerProcessPath)) : ChildApp.getServerProcessPath(item)
        const pidArr = runningProcessMap.get(servPath)
        let pid = null
        //Port Status
        if (item.checkServerMode == EnumServerStatusCheckMode.PortStatus) {
            for (const pidItem of pidArr) {
                if (tcpProcessMap.get(pidItem) == item.ServerPort) {
                    pid = pidItem
                    break
                }
            }
        } else {
            pid = pidArr?.[0]
        }
        item.isRunning = !!pid
        item.pid = pid ?? null
        return item
    }

    const statelessProcessList = isVue ? serverList.value : serverList
    const promiseArray = statelessProcessList.map((item) => initServerStatus(item))
    return await Promise.all(promiseArray)
}
