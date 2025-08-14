<template>
  <ConfigProvider>
    <a-spin :spinning="store.loading" :tip="store.loadingTip + ' ...'" size="large" style="height: 100vh">
      <a-layout>
        <a-row>
          <a-col :span="4" style="height: 100vh">
            <SideBar />
          </a-col>
          <a-col :span="20" style="display: flex; flex-direction: column; height: 100vh">
            <TitleBar />
            <router-view />
          </a-col>
        </a-row>
        <!--  v-if防止不显示就执行modal里面的代码-->
        <user-pwd-modal v-if="userPwdModalShow" v-model:show="userPwdModalShow" :cancel-is-exit="true" />
        <set-language v-if="setLanguageShow" v-model:show="setLanguageShow"></set-language>
      </a-layout>
    </a-spin>
  </ConfigProvider>
</template>

<script setup>
import { isDev, isMacOS, isWindows } from '@/shared/utils/utils2'
import TitleBar from './layouts/TitleBar.vue'
import SideBar from './layouts/SideBar.vue'
import App from '@/main/App'
import { onMounted, ref, watch } from 'vue'
import MessageBox from '@/renderer/utils/MessageBox'
import UserPwdModal from '@/renderer/components/UserPwdModal.vue'
import SystemService from '@/main/utils/SystemService'
import { message } from 'ant-design-vue'
import DirUtil from '@/main/utils/DirUtil'
import { MAC_DATA_DIR } from '@/main/helpers/constant'
import ConfigProvider from '@/renderer/layouts/Theme/ConfigProvider.vue'
import SetLanguage from '@/renderer/components/SetLanguage.vue'
import { useMainStore } from '@/renderer/store'
import Settings from '@/main/Settings'
import { t } from '@/renderer/utils/i18n'
import { changeLanguageWrapper } from '@/renderer/utils/language'
import { OFFICIAL_URL } from '@/shared/helpers/constant'
import Ipc from '@/renderer/utils/Ipc'

const store = useMainStore()
//操作childAppList和serverList等JS代码，都要等待init完成。
store.init().then(async () => {
  const AppService = await import('@/renderer/services/AppService')
  AppService.default.storeInitThen()
})
const userPwdModalShow = ref(false)
const setLanguageShow = ref(false)

const settings = Settings.getAll()
store.changeTheme(settings.ThemeMode, settings.ThemeColor)
store.settings = settings

onMounted(async () => {
  try {
    if (!isDev && (await App.initFileExists())) {
      //init或者update
      if (await App.needInit()) {
        await App.checkInstallBefore()
        await init()
      } else {
        await update() //覆盖安装就执行update
      }
    }

    Ipc.callStatic('TrayManage', 'init')
    changeLanguageWrapper(store.settings.Language)
  } catch (error) {
    await MessageBox.error(error.message ?? error, t('errorOccurredDuring', [t('initializing')]))
    await Ipc.call('appExit')
  }

  if (isWindows) {
    stopIIS()
  }
  parseAppNotice()
})

async function init() {
  store.loadingTip = t('Initializing')

  if (isMacOS) {
    //调用设置（electron-store）会自动创建USER_CORE_DIR，为了捕捉创建失败的错误，先提前写好创建文件夹的代码。
    await macCreateUserCoreDir()
  }

  setLanguageShow.value = true
  watch(setLanguageShow, async (setLanguageShow) => {
    if (!setLanguageShow) {
      if (isWindows) {
        await winInit()
      } else if (isMacOS) {
        userPwdModalShow.value = true
      }
    }
  })
}

async function winInit() {
  try {
    store.loading = true
    await App.init()
    await store.refreshChildAppList()
    store.loading = false
  } catch (error) {
    await MessageBox.error(error.message ?? error, t('errorOccurredDuring', [t('initializing')]))
    await Ipc.call('appExit')
  }
}

async function macCreateUserCoreDir() {
  try {
    if (!(await DirUtil.Exists(MAC_DATA_DIR))) {
      await DirUtil.Create(MAC_DATA_DIR)
    }
  } catch (error) {
    await MessageBox.error(error.message ?? error, t('errorOccurredDuring', [t('initializing')]))
    await Ipc.call('appExit')
  }
}

async function update() {
  try {
    store.loading = true
    const needRestart = await App.update()
    if (needRestart) await Ipc.call('appRestart')
    store.loading = false
  } catch (error) {
    await MessageBox.error(error.message ?? error, t('errorOccurredDuring', [t('update')]))
    await Ipc.call('appExit')
  }
}

async function stopIIS() {
  const IISServiceName = 'W3SVC'
  if (await SystemService.isRunning(IISServiceName)) {
    await SystemService.stop(IISServiceName)
    message.info('')
  }
}

/**
 * 解析远程通知和广告
 * @returns {Promise<void>}
 */
async function parseAppNotice() {
  try {
    const response = await fetch(`${OFFICIAL_URL}/AppAdES.json?v=${Date.now()}`)
    store.noticeList = await response.json()
  } catch {
    /* empty */
  }
}
</script>

<style></style>
