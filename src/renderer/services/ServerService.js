import { useMainStore } from '@/renderer/store'
import { storeToRefs } from 'pinia'
import HomeService from '@/renderer/services/HomeService'

const store = useMainStore()
const { serviceList } = storeToRefs(store)

export default class ServerService {
    static async restart(name) {
        const item = serviceList.value.find((item) => item.Name === name)
        if (item) await HomeService.restartServiceClick(item)
    }

    static isRunning(name) {
        const item = serviceList.value.find((item) => item.Name === name)
        return item && item.isRunning
    }
}
