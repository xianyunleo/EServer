import Settings from '@/main/Settings'
import TimerService from '@/renderer/services/TimerService'
import { StoreInitializedEventName } from '@/renderer/utils/constant'

export default class AppService {
    static storeInitThen() {
        const storeInitializedEvent = new Event(StoreInitializedEventName)
        window.dispatchEvent(storeInitializedEvent)

        if (Settings.get('AutoTimerRestartServer') && Settings.get('AutoTimerServerList')) {
            TimerService.setRestartTimer()
        }
    }
}
