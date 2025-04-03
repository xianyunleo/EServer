<template>
  <a-card size="small" :title="t('Other')" class="settings-card">
    <div class="settings-card-row flex-vertical-center">
      <span>{{ mt('Text', 'ws', 'Editor') }}：</span>
      <a-input v-model:value="store.settings.TextEditor" readonly style="flex: 1"></a-input>
      <a-button @click="changeTextEditor" style="margin-left: 5px">...</a-button>
    </div>

    <div class="settings-card-row flex-vertical-center">
      <span>{{ mt('Website', 'ws', 'Directory') }}：</span>
      <a-input v-model:value="store.settings.WebsiteDir" readonly style="flex: 1"></a-input>
      <a-button @click="changeWebsiteDir" style="margin-left: 5px">...</a-button>
    </div>

    <a-row type="flex" align="middle" class="settings-card-row">
      <a-col :span="6" class="flex-vertical-center">
        <a-button @click="exitApp" type="primary">{{ t('Exit') }} {{ APP_NAME }}</a-button>
      </a-col>
      <a-col :span="6" class="flex-vertical-center">
        <a-button @click="restartApp" type="primary">{{ t('Restart') }} {{ APP_NAME }}</a-button>
      </a-col>
      <a-col :span="6" class="flex-vertical-center">
        <a-button @click="init" type="primary">{{ t('Initialize') }}</a-button>
      </a-col>
    </a-row>
  </a-card>
</template>

<script setup>
import MessageBox from '@/renderer/utils/MessageBox'
import ChildAppInit from '@/main/services/childApp/ChildAppInit'
import { message } from 'ant-design-vue'
import { mt, t } from '@/renderer/utils/i18n'
import { APP_NAME } from '@/shared/utils/constant'
import { createAsyncComponent } from '@/renderer/utils/utils'
import { useMainStore } from '@/renderer/store'
import Ipc from '@/renderer/utils/Ipc'
const call = Ipc.call
const callStatic = Ipc.callStatic
const ACard = createAsyncComponent(import('ant-design-vue'), 'Card')
const store = useMainStore()

const changeTextEditor = () => {
  store.setSettings('TextEditor', async (originVal) => {
    let path = await callStatic('FileDialog', 'showOpenApp', originVal)
    if (!path) {
      return false
    }
    return path
  })
}

const changeWebsiteDir = () => {
  store.setSettings('WebsiteDir', async (originVal) => {
    let path = await callStatic('FileDialog', 'showOpenDirectory', originVal)
    if (!path) {
      return false
    }
    if (path.includes(' ')) {
      throw new Error(t('The website directory cannot have spaces!'))
    }
    return path
  })
}

const exitApp = () => call('appExit')
const restartApp = () => call('appRestart')

const init = async () => {
  try {
    const options = {
      content: t('initConfirmText'),
      okText: t('Confirm'),
      cancelText: t('Cancel')
    }
    if (await MessageBox.confirm(options)) {
      await ChildAppInit.initAll()
      message.success(t('Initialization successful'))
    }
  } catch (error) {
    MessageBox.error(error.message ?? error, t('Initialization failed!'))
  }
}
</script>

<style scoped></style>
