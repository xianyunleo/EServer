import { useMainStore } from '@/renderer/store'
import { storeToRefs } from 'pinia'
import { setInterval,clearInterval } from 'timers'
import Settings from '@/main/Settings'
import ServerService from '@/renderer/services/ServerService'

const store = useMainStore()
const { serverList } = storeToRefs(store)

export default class TimerService {
    static intervalId

    static setRestartTimer() {
        if (TimerService.intervalId) {
            clearInterval(TimerService.intervalId)
        }
        if (store.settings.AutoTimerRestartServer && store.settings.AutoTimerInterval) {
            TimerService.intervalId = setInterval(() => {
                TimerService.restartServer()
            }, store.settings.AutoTimerInterval * 1000)
        }
    }

    static async restartServer() {
        const initServerStatus = async (item) => {
            const processList = Settings.get('AutoTimerServerList')
            if (processList.length > 0 && processList.includes(item.Name)) ServerService.restart(item.Name)
        }

        const promiseArray = serverList.value.map((item) => initServerStatus(item))
        await Promise.all(promiseArray)
    }
}
