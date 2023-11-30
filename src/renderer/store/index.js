import { defineStore } from 'pinia'
import Software from '@/main/core/software/Software'
import { enumGetName } from '@/shared/utils/utils'
import { EnumSoftwareType } from '@/shared/utils/enum'
import Settings from '@/main/Settings'
import MessageBox from '@/renderer/utils/MessageBox'
import { t } from '@/shared/utils/i18n'
import SystemTheme from '@/main/utils/SystemTheme'
import { theme } from 'ant-design-vue'
import { setTwoToneColor } from '@ant-design/icons-vue'

export const useMainStore = defineStore('main', {
    state: () => {
        return {
            softwareList: [], //软件列表
            nginxServer: null,
            softwareTypeSelected: '',
            loading: false,
            loadingTip: 'Loading',
            settings: {},
            customTheme: {},
            websiteList: { showSecondDomainName: false, showNote: false },
        }
    },
    getters: {
        //已安装的server软件列表
        serverList(state) {
            let phpTypeName = enumGetName(EnumSoftwareType, EnumSoftwareType.PHP)
            let serverTypeName = enumGetName(EnumSoftwareType, EnumSoftwareType.Server)
            let typeArr = [phpTypeName, serverTypeName]

            return state.softwareList.filter(item => item.Installed && typeArr.includes(item.Type))
        }
    },
    actions: {
        async init() {
            await this.refreshSoftwareList()
            this.settings = Settings.getAll()
            await this.changeTheme(this.settings.ThemeMode, this.settings.ThemeColor);
        },
        async refreshSoftwareList() {
            const list = await Software.getList()
            this.softwareList = await Promise.all(list.map(async item => {
                const Installed = Software.IsInstalled(item)
                return { ...item, Installed }
            }))
            this.nginxServer = this.softwareList.find((item) => item.Name === 'Nginx')
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
        async changeTheme(modeStr, primaryColor) {
            const isDark = modeStr === 'dark' || (modeStr === 'system' && SystemTheme.isDarkModel())
            let customToken = {
                colorBgLayout: '#F5F7FA',
                colorPrimary: primaryColor,
                borderRadius: 5
            }

            let darkToken = {
                colorBgLayout: '#202020',
                colorBgContainer: '#303030',
                colorBorder: 'rgba(255, 255, 255, 0.15)',
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
