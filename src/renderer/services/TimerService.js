import { useMainStore } from '@/renderer/store'
import { storeToRefs } from 'pinia'
import { setInterval,clearInterval } from 'timers'
import Settings from '@/main/Settings'
import ServerService from '@/renderer/services/ServerService'

const store = useMainStore()
const { serviceList } = storeToRefs(store)

export default class TimerService {
    static intervalId

    static setRestartTimer() {
        if (TimerService.intervalId) {
            clearInterval(TimerService.intervalId)
        }
        if (store.settings.AutoTimerRestartService && store.settings.AutoTimerInterval) {
            TimerService.intervalId = setInterval(() => {
                TimerService.restartService()
            }, store.settings.AutoTimerInterval * 1000)
        }
    }

    static async restartService() {
        const asyncFunc = async (item) => {
            const processList = Settings.get('AutoTimerServiceList')
            if (processList.length > 0 && processList.includes(item.Name)) ServerService.restart(item.Name)
        }

        const promiseArray = serviceList.value.map((item) => asyncFunc(item))
        await Promise.all(promiseArray)
    }
}
