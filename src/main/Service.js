import OneClick from '@/shared/utils/OneClick'
import TcpProcess from '@/main/utils/TcpProcess'
import ProcessExtend from '@/main/utils/ProcessExtend'
import ServerControl from '@/main/services/ServerControl'
import ChildApp from '@/main/services/childApp/ChildApp'
import CustomChildApp from '@/main/services/childApp/CustomChildApp'
import { filterServerList } from '@/shared/utils/childApp'
import { getProcessList, initServerListStatus } from '@/shared/helper/process'
import ProcessLibrary from '@/main/utils/ProcessLibrary'

export default class Service {
    static async start() {
        const startFunc = async (item) => {
            if (item.isRunning) {
                return
            }
            if (item.ServerPort) {
                const pid = await TcpProcess.getPidByPort(item.ServerPort)
                if (pid) await ProcessExtend.kill(pid, true)
            }
            await ServerControl.start(item)
        }
        const serverList = await Service.getServerList()
        await OneClick.handle(startFunc, serverList)
    }

    static async stop() {
        const stopFunc = async (item) => {
            await ServerControl.stop(item)
        }
        const serverList = await Service.getServerList()
        await OneClick.handle(stopFunc, serverList)
    }

    static async getServerList() {
        const list1 = await (await ChildApp.getList()).filterAsync(async (item) => await ChildApp.IsInstalled(item))
        const list2 = await CustomChildApp.getList()
        let serverList = filterServerList([...list1, ...list2])
        const processList = await getProcessList(async (options) => {
            return await ProcessLibrary.getList(options)
        })
        return await initServerListStatus(serverList, processList)
    }
}
