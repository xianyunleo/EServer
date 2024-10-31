<template>
  <a-card size="small" :title="`${t('Server')} & ${t('OneClick')}`" class="settings-card">
    <div class="settings-card-row flex-vertical-center">
      <span>{{ mt('Server', 'ws', 'List') }}：</span>

      <a-select
        v-model:value="store.settings.OneClickServerList"
        :options="oneClickServerOptions" @change="oneClickServerChange"
        mode="multiple" :placeholder="t('pleaseChoose')" style="flex: 1"
      ></a-select>
    </div>

    <div class="settings-card-row flex-vertical-center">
      <a-switch v-model:checked="store.settings.AutoStartAndRestartServer" class="settings-switch"
                :disabled="emptyOneClickServerList()" @change="changeAutoStartAndRestartServer" />
      <span :class="disabledTextClass()">{{ t('websiteAutoRestartText') }}</span>
    </div>

    <div class="settings-card-row flex-vertical-center">
      <a-switch v-model:checked="store.settings.AfterOpenAppStartServer" class="settings-switch"
                :disabled="emptyOneClickServerList()" @change="changeAfterOpenAppStartServer" />
      <span :class="disabledTextClass()">{{ t('afterOpenAppStartServer')
        }}</span>
    </div>
  </a-card>
</template>

<script setup>
import { useMainStore } from '@/renderer/store'
import { storeToRefs } from 'pinia'
import { mt, t } from '@/renderer/utils/i18n'
import { createAsyncComponent } from '@/renderer/utils/utils'
import { computed } from 'vue'

const ACard = createAsyncComponent(import('ant-design-vue'), 'Card')
const store = useMainStore()
const { serverList } = storeToRefs(store)
const oneClickServerOptions = computed(() => {
  const options = serverList.value.map((item) => {
    const name = item.Name
    return { value: name, label: item.ServerName ? item.ServerName : name }
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

const emptyOneClickServerList = () => store.settings.OneClickServerList.length === 0
const disabledTextClass = () => emptyOneClickServerList() ? 'disabled-text' : ''
</script>

<style scoped></style>
