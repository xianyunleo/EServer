import ServerControl from '@/main/services/ServerControl'
import { sleep } from '@/shared/utils/utils'
import TcpProcess from '@/main/utils/TcpProcess'
import ProcessExtend from '@/main/utils/ProcessExtend'
import { t } from '@/renderer/utils/i18n'
import MessageBox from '@/renderer/utils/MessageBox'
import { watch } from 'vue'
import { useMainStore } from '@/renderer/store'
import { storeToRefs } from 'pinia'
import OneClick from '@/shared/utils/OneClick'

const store = useMainStore()
const { serverList } = storeToRefs(store)

export default class HomeService {
    static async startServerClick(item) {
        if (item.isRunning || item.btnLoading) {
            return
        }
        item.btnLoading = true
        try {
            if (item.ServerPort) {
                const pid = await TcpProcess.getPidByPort(item.ServerPort)
                if (pid) await ProcessExtend.kill(pid, true)
            }

            await ServerControl.start(item)
            if (!item.unwatch) {
                item.unwatch = watch(
                    () => item.errMsg,
                    (errMsg) => {
                        if (errMsg) {
                            MessageBox.error(errMsg, t('Error starting server!',[item.Name]))
                        }
                    }
                )
            }
        } catch (error) {
            MessageBox.error(error.message ?? error, t('Error starting server!',[item.Name]))
        }
        item.btnLoading = false
    }

    static async stopServerClick(item) {
        if (!item.isRunning) {
            return
        }
        item.btnLoading = true
        try {
            await ServerControl.stop(item)

            for (let i = 0; i < 10; i++) {
                if (item.isRunning === false) {
                    break
                }
                await sleep(500)
                item.isRunning = ProcessExtend.pidIsRunning(item.pid)
            }
        } catch (error) {
            MessageBox.error(error.message ?? error, t('Error stopping server!',[item.Name]))
        }
        item.btnLoading = false
    }

    static async restartServerClick(item) {
        item.btnLoading = true
        try {
            await ServerControl.stop(item)

            for (let i = 0; i < 10; i++) {
                if (item.isRunning === false) {
                    break
                }
                await sleep(500)
                item.isRunning = ProcessExtend.pidIsRunning(item.pid)
            }

            if (item.isRunning) {
                throw new Error(t('The server was not stopped successfully!',[item.Name]))
            }

            await ServerControl.start(item)
        } catch (error) {
            MessageBox.error(error.message ?? error, t('Error starting server!',[item.Name]))
        }
        item.btnLoading = false
    }

    static oneClickStart() {
        OneClick.handle(HomeService.startServerClick, serverList.value)
    }

    static oneClickStop() {
        OneClick.handle(HomeService.stopServerClick, serverList.value)
    }
}
