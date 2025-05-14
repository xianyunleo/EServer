import OneClick from '@/shared/utils/OneClick'
import TcpProcess from '@/main/utils/TcpProcess'
import ProcessExtend from '@/main/utils/ProcessExtend'
import ServerControl from '@/main/services/ServerControl'

export default class Service {
    static async start() {
        const startFunc = async (item) => {
            if (item.ServerPort) {
                const pid = await TcpProcess.getPidByPort(item.ServerPort)
                if (pid) await ProcessExtend.kill(pid, true)
            }
            await ServerControl.start(item)
        }
        OneClick.handle(startFunc)
    }

    static async stop() {
        const stopFunc = async (item) => {
            await ServerControl.stop(item)
        }
        OneClick.handle(stopFunc)
    }
}
