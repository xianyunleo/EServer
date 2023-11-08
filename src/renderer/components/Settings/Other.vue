<template>
  <a-card size="small" :title="t('Other')" class='settings-card'>
    <div class='settings-card-row flex-vertical-center'>
        <span>{{ mt('Text', 'ws', 'Editor') }}：</span>
        <a-input v-model:value='settingsReactive.TextEditor' readonly style='flex: 1'></a-input>
        <a-button @click='changeTextEditor' style='margin-left: 5px'>...</a-button>
    </div>

    <div class='settings-card-row flex-vertical-center'>
        <span>{{ mt('Website', 'ws', 'Directory') }}：</span>
        <a-input v-model:value='settingsReactive.WebsiteDir' readonly style='flex: 1'></a-input>
        <a-button @click='changeWebsiteDir' style='margin-left: 5px'>...</a-button>
    </div>

    <div class='settings-card-row flex-vertical-center'>
      <a-switch v-model:checked='settingsReactive.AutoStartAndRestartServer' @change='changeAutoStartAndRestartServer'
                class='settings-switch' />
      <span>{{ t('autoStartAndRestartServer') }}</span>
    </div>

    <a-row type='flex' align='middle' class='settings-card-row'>
      <a-col :span='6' class='flex-vertical-center'>
        <a-button @click='exitApp' type='primary'>{{ t('Exit') }} {{APP_NAME}}</a-button>
      </a-col>
      <a-col :span='6' class='flex-vertical-center'>
        <a-button @click='init' type='primary'>{{ t('Initialize') }}</a-button>
      </a-col>
    </a-row>

  </a-card>
</template>

<script setup>
import {defineAsyncComponent, inject} from 'vue'
import FileDialog from '@/main/utils/FileDialog'
import MessageBox from '@/renderer/utils/MessageBox'
import SoftwareInit from '@/main/core/software/SoftwareInit'
import { message } from 'ant-design-vue'
import { mt, t } from '@/shared/utils/i18n'
import {APP_NAME} from "@/shared/utils/constant";
import App from "@/main/App";

const props = defineProps({
  setFn: Function
})

const { settingsReactive } = inject('GlobalProvide')
const setFn = (key, callback = null) => props.setFn(key, callback)
const ACard = defineAsyncComponent(() => {
  return new Promise((resolve) => {
    import('ant-design-vue').then((modules) => {
      resolve(modules.Card)
    })
  })
})

const changeTextEditor = () => {
  setFn('TextEditor', async originVal => {
    let path = FileDialog.showOpenApp(originVal)
    if (!path) {
      return false
    }
    return path
  })
}

const changeWebsiteDir = () => {
  setFn('WebsiteDir', async originVal => {
    let path = FileDialog.showOpenDirectory(originVal)
    if (!path) {
      return false
    }
    if (path.includes(' ')) {
      throw new Error('网站目录不能有空格！')
    }
    return path
  })
}

const changeAutoStartAndRestartServer = () => {
  setFn('AutoStartAndRestartServer')
}

const exitApp = ()=>{
  App.exit()
}

const init = async () => {
  try {
    const options = {
      content: t('initConfirmText'),
      okText: t('Confirm'),
      cancelText: t('Cancel')
    }
    if (await MessageBox.confirm(options)) {
      await SoftwareInit.initAll()
      message.success('初始化成功')
    }
  } catch (error) {
    MessageBox.error(error.message ?? error, '初始化失败！')
  }
}

</script>

<style scoped>

</style>
