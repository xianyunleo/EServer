import { defineStore } from 'pinia'
import Software from '@/main/core/software/Software'
import Settings from '@/main/Settings'
import MessageBox from '@/renderer/utils/MessageBox'
import { t } from '@/renderer/utils/i18n'
import SystemTheme from '@/main/utils/SystemTheme'
import { theme } from 'ant-design-vue'
import { setTwoToneColor } from '@ant-design/icons-vue'
import { colorConst } from '@/shared/utils/constant'

export const useMainStore = defineStore('main', {
    state: () => {
        return {
            softwareList: [], //软件列表
            serverList: [], //已安装的服务列表
            softwareTypeSelected: '',
            loading: false,
            loadingTip: 'Loading',
            settings: {},
            customTheme: {},
            websiteList: { showSecondDomainName: false, showNote: false },
            afterOpenAppStartServerMark: true,
        }
    },
    getters: {},
    actions: {
        async init() {
            await this.refreshSoftwareList()
        },
        async refreshSoftwareList() {
            const list = await Software.getList()
            this.softwareList = await Promise.all(list.map(async item => {
                const Installed = await Software.IsInstalled(item)
                return { ...item, Installed }
            }))
        },
        async setSettings(key, callback = null) {
            const originVal = Settings.get(key)
            try {
                if (callback) {
                    const res = await callback(originVal)
                    if (res === false) {
                        return
                    }
                    //callback没有返回值
                    if (res === undefined) {
                        Settings.set(key, this.settings[key])
                    } else {
                        this.settings[key] = res
                        Settings.set(key, res)
                    }
                } else {
                    //无callback的情况
                    Settings.set(key, this.settings[key])
                }
            } catch (error) {
                this.settings[key] = originVal
                MessageBox.error(error.message ?? error, t('errorOccurredDuring', [t('set')]))
            }
        },
         changeTheme(modeStr, primaryColor) {
            const isDark = modeStr === 'dark' || (modeStr === 'system' && SystemTheme.isDarkModel())
            let customToken = {
                colorBgLayout: colorConst.light.bgColor,
                colorPrimary: primaryColor,
                borderRadius: 5
            }

            let darkToken = {
                colorBgLayout: colorConst.dark.bgColor,
                colorBgContainer: '#303030',
                colorBorderSecondary: 'rgba(255, 255, 255, 0.06)',
                colorSplit: 'rgba(255, 255, 255, 0.06)',
                colorBgElevated: '#3F3F3F'
            }
            if (isDark) {
                customToken = { ...customToken, ...darkToken }
            }
            this.customTheme = {
                algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
                token: customToken
            }

            setTwoToneColor(primaryColor)
        }
    }
})
