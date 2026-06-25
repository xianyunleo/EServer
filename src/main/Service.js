import OneClick from '@/shared/helpers/OneClick'
import TcpProcess from '@/main/utils/TcpProcess'
import ProcessExtend from '@/main/utils/ProcessExtend'
import ServiceControl from '@/main/services/ServiceControl'
import ChildApp from '@/main/services/childApp/ChildApp'
import CustomChildApp from '@/main/services/childApp/CustomChildApp'
import { filterServiceList } from '@/shared/helpers/childApp'
import { getProcessList, initServiceListStatus } from '@/shared/helpers/process'
import ProcessLibrary from '@/main/helpers/ProcessLibrary'
import { EnumServerStatusCheckMode } from '@/shared/helpers/enum'

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
            await ServiceControl.start(item)
        }
        const serviceList = await Service.getServiceList()
        await OneClick.handle(startFunc, serviceList)
    }

    static async stop() {
        const stopFunc = async (item) => {
            await ServiceControl.stop(item)
        }
        const serviceList = await Service.getServiceList()
        await OneClick.handle(stopFunc, serviceList)
    }

    static async getServiceList() {
        const list1 = await (await ChildApp.getList()).filterAsync(async (item) => await ChildApp.IsInstalled(item))
        const list2 = await CustomChildApp.getList()
        let serviceList = filterServiceList([...list1, ...list2])
        const runningProcessList = await getProcessList(async (options) => {
            return await ProcessLibrary.getList(options)
        })
        const portCheckServer = serviceList?.find((item) => item.checkServerMode == EnumServerStatusCheckMode.PortStatus)
        //如果有serviceList有一个声明了端口号检查，那么获取tcp进程列表
        const tcpProcessList = portCheckServer ? await TcpProcess.getList() : []
        return await initServiceListStatus(serviceList, runningProcessList, tcpProcessList)
    }
}
