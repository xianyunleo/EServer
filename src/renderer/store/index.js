import { defineStore } from 'pinia'
import ChildApp from '@/main/core/childApp/ChildApp'
import Settings from '@/main/Settings'
import MessageBox from '@/renderer/utils/MessageBox'
import { t } from '@/renderer/utils/i18n'
import SystemTheme from '@/main/utils/SystemTheme'
import { theme } from 'ant-design-vue'
import { setTwoToneColor } from '@ant-design/icons-vue'
import { colorConst } from '@/shared/utils/constant'
import { filterServerList } from '@/shared/utils/childApp'
import CustomChildApp from '@/main/core/childApp/CustomChildApp'

export const useMainStore = defineStore('main', {
    state: () => {
        return {
            childAppList: [], //子应用列表，不包含自定义的
            customChildAppList: [], //自定义子应用列表
            installedChildAppList: [], //已安装的子应用列表，不包含自定义的
            childAppTypeSelected: '',
            loading: false,
            loadingTip: 'Loading',
            settings: {},
            customTheme: {},
            websiteList: { showSecondDomainName: false, showNote: false },
            Home: {
                firstLoadingHandled: false
            },
            noticeList:[]
        }
    },
    getters: {
        //server列表，包含自定义的
        serverList(state) {
            return filterServerList([...state.installedChildAppList,...state.customChildAppList])
        }
    },
    actions: {
        async init() {
            await this.refreshChildAppList()
            await this.refreshCustomChildAppList()
        },
        async refreshChildAppList() {
            const list = await ChildApp.getList()
            this.childAppList = await Promise.all(list.map(async item => {
                const Installed = await ChildApp.IsInstalled(item)
                return { ...item, Installed }
            }))
            this.refreshInstalledList()
        },
        async refreshInstalledList(){
            this.installedChildAppList = this.childAppList.filter(item => item.Installed)
        },
        async refreshCustomChildAppList() {
            let customChildAppList = await CustomChildApp.getList() //自定义子应用，不判断是否已安装
            customChildAppList = customChildAppList.map(item => ({ ...item, IsCustom: true }))
            this.customChildAppList = customChildAppList
        },
        async setSettings(key, beforeFunc = null) {
            const originVal = Settings.get(key)
            try {
                if (beforeFunc) {
                    const res = await beforeFunc(originVal)
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
