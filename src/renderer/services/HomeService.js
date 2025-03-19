import ServerControl from '@/main/core/ServerControl'
import { sleep } from '@/shared/utils/utils'
import TcpProcess from '@/main/utils/TcpProcess'
import ProcessExtend from '@/main/utils/ProcessExtend'
import { t } from '@/renderer/utils/i18n'
import MessageBox from '@/renderer/utils/MessageBox'
import Settings from '@/main/Settings'
import { watch } from 'vue'
import { useMainStore } from '@/renderer/store'
import { storeToRefs } from 'pinia'
import ChildAppExtend from '@/main/core/childApp/ChildAppExtend'

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
                            MessageBox.error(errMsg, t('Error starting server!'))
                        }
                    }
                )
            }
        } catch (error) {
            MessageBox.error(error.message ?? error, t('Error starting server!'))
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
            MessageBox.error(error.message ?? error, t('Error stopping server!'))
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
                throw new Error(t('The server was not stopped successfully!'))
            }

            await ServerControl.start(item)
        } catch (error) {
            MessageBox.error(error.message ?? error, t('Error starting server!'))
        }
        item.btnLoading = false
    }

    static async oneClickStart() {
        const oneClickServerList = Settings.get('OneClickServerList')
        const websitePhpFpmSwitch = oneClickServerList.includes('PHP-FPM')
        const requirePhpList = await HomeService.getNginxRequirePhpList()
        const doStartServerClick = async (item) => {
            if (oneClickServerList.includes(item.Name)) {
                HomeService.startServerClick(item)
            } else if (item.Name.match(/^PHP-[.\d]+$/) && requirePhpList.includes(item.Name) && websitePhpFpmSwitch) {
                //自动判断网站列表的PHP-FPM
                HomeService.startServerClick(item)
            }
        }

        for (const item of serverList.value) {
            doStartServerClick(item)
        }
    }

    static async oneClickStop() {
        const oneClickServerList = Settings.get('OneClickServerList')
        const websitePhpFpmSwitch = oneClickServerList.includes('PHP-FPM')
        const requirePhpList = await HomeService.getNginxRequirePhpList()
        const doStopServerClick = async (item) => {
            if (oneClickServerList.includes(item.Name)) {
                HomeService.stopServerClick(item)
            } else if (item.Name.match(/^PHP-[.\d]+$/) && requirePhpList.includes(item.Name) && websitePhpFpmSwitch) {
                //自动判断网站列表的PHP-FPM
                HomeService.stopServerClick(item)
            }
        }

        for (const item of serverList.value) {
            doStopServerClick(item)
        }
    }

    static async getNginxRequirePhpList() {
        const list = await ChildAppExtend.getNginxRequirePhpList()
        return list.map((item) => `PHP-${item}`)
    }
}
