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

    <div class="settings-card-row" v-if="isWindows">
      <a-flex gap="small" align="center">
        <span>Windows Service：</span>
        <a-button type="primary" @click="createWindowsService()">{{ t('Create') }}</a-button>
        <a-button type="primary" @click="delWindowsService()">{{ t('Delete') }}</a-button>
        <a-button type="primary" @click="openWindowsServices()">{{ t('Open')}}  Windows Services</a-button>
      </a-flex>
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
import { message } from 'ant-design-vue'
import { computed } from 'vue'
import { isWindows } from '@/main/utils/utils'
import SystemService from '@/main/utils/SystemService'
import { SERVICE_NAME } from '@/shared/utils/constant'
import path from 'path'
import GetPath from '@/shared/utils/GetPath'
import Opener from '@/renderer/utils/Opener'

const ACard = createAsyncComponent(import('ant-design-vue'), 'Card')
const AFlex = createAsyncComponent(import('ant-design-vue'), 'Flex')
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

const createWindowsService = async () => {
  message.info(t('pleaseWait'))
  if (await SystemService.exists(SERVICE_NAME)) {
    return
  } else {
    const binPath = path.join(GetPath.getDir(), `${SERVICE_NAME}.exe`)
    const pathWithArgs = `${binPath} ${GetPath.getExePath()}`
    await SystemService.create(SERVICE_NAME, pathWithArgs)
  }
  message.info(t('Done'))
}

const delWindowsService = async () => {
  message.info(t('pleaseWait'))
  if (await SystemService.exists(SERVICE_NAME)) {
    await SystemService.delete(SERVICE_NAME)
  }
  message.info(t('Done'))
}

const openWindowsServices = () => {
  message.info(t('pleaseWait'))
  Opener.openWindowsServices()
}

const emptyOneClickServerList = () => store.settings.OneClickServerList.length === 0
const disabledTextClass = () => (emptyOneClickServerList() ? 'disabled-text' : '')
</script>

<style scoped></style>
