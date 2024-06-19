<template>
  <a-card size="small" :title="t('Server')" class="settings-card">
    <div class='settings-card-row flex-vertical-center'>
      <a-tooltip>
        <template #title>{{ t('OneClick') }}</template>
        <span>{{mt('Server','ws','List')}}：</span>
      </a-tooltip>

        <a-select
            v-model:value="store.settings.OneClickServerList"
            :options="oneClickServerOptions"
            @change="oneClickServerChange"
            mode="multiple" placeholder="请选择" style="flex: 1"
        ></a-select>
    </div>

    <div class='settings-card-row flex-vertical-center'>
      <a-switch v-model:checked='store.settings.AutoStartAndRestartServer' @change='changeAutoStartAndRestartServer'
                class='settings-switch' />
      <span>{{ t('websiteAutoRestartText') }}</span>
    </div>

    <div class='settings-card-row flex-vertical-center'>
      <a-switch v-model:checked='store.settings.AfterOpenAppStartServer' @change='changeAfterOpenAppStartServer'
                class='settings-switch' />
      <span>{{ t('afterOpenAppStartServer') }}</span>
    </div>
  </a-card>
</template>

<script setup>
import {useMainStore} from "@/renderer/store";
import {storeToRefs} from "pinia";
import { mt, t } from '@/renderer/utils/i18n'
import { createAsyncComponent } from '@/renderer/utils/utils'
import { computed } from 'vue'

const ACard = createAsyncComponent(import('ant-design-vue'), 'Card')
const store = useMainStore()
const { serverList } = storeToRefs(store)
//把PHP-FPM-X.X 过滤掉
const oneClickServerOptions = computed(() => {
  const options = serverList.value.map(item => {
    let name = item.Name
    let obj = { value: name, name }
    if (name === 'Nginx') {
      obj.disabled = true
    }
    return obj
  })
  options.unshift({ label: t('Website') + ' PHP-FPM', value: 'PHP-FPM' })
  return options
})

const oneClickServerChange = () => {
  store.setSettings('OneClickServerList')
}
const changeAutoStartAndRestartServer = () => {
  store.setSettings('AutoStartAndRestartServer')
}
const changeAfterOpenAppStartServer = () => {
  store.setSettings('AfterOpenAppStartServer')
}
</script>

<style scoped>

</style>
