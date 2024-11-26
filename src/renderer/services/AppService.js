import HomeService from '@/renderer/services/HomeService'
import Settings from '@/main/Settings'
import TimerService from '@/renderer/services/TimerService'
import { StoreInitializedEventName } from '@/renderer/utils/constant'

export default class AppService {
    static storeInitThen() {
        console.log('Call storeInitThen')
        const storeInitializedEvent = new Event(StoreInitializedEventName)
        window.dispatchEvent(storeInitializedEvent)

        if (Settings.get('AfterOpenAppStartServer')) {
            HomeService.oneClickStart()
        }
        if (Settings.get('AutoTimerRestartServer') && Settings.get('AutoTimerServerList')) {
            TimerService.setRestartTimer()
        }
    }
}
