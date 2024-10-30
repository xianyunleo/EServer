<template>
  <a-card size="small" :title="t('Timer')" class="settings-card">
    <div class="settings-card-row flex-vertical-center">
      <a-tooltip>
        <template #title>{{ t('TimerServerList') }}</template>
        <span>{{ mt('Server', 'ws', 'List') }}</span>
      </a-tooltip>

      <a-select
        v-model:value="store.settings.AutoTimerServerList"
        :options="TimerServerOptions"
        mode="multiple"
        style="flex: 1"
        placeholder="请选择"
        @change="AutoTimerServerChange"
      ></a-select>
    </div>

    <div class="interval-card-row flex-vertical-center">
      <a-tooltip>
        <template #title>{{ t('RestartIntervalText') }}</template>
        <span>{{ t('RestartIntervalText') }}：</span>
      </a-tooltip>

      <a-select v-model:value="store.settings.AutoTimerInterval" :options="intervalOptions" placeholder="选择重启间隔" style="flex: 1" @change="changeAutoTimerInterval"></a-select>
    </div>

    <div class="settings-card-row flex-vertical-center">
      <a-switch v-model:checked="store.settings.AutoTimerRestartServer" class="settings-switch" @change="changeAutoTimerRestartServer" />
      <span>{{ t('ServerAutoRestartText') }}</span>
    </div>
  </a-card>
</template>

<script setup>
import { setInterval } from 'timers'
import { computed, watch, inject, onMounted } from 'vue'
import { useMainStore } from '@/renderer/store'
import { storeToRefs } from 'pinia'
import { mt, t } from '@/renderer/utils/i18n'
import { createAsyncComponent } from '@/renderer/utils/utils'
import Settings from '@/main/Settings'

function formatUnitLabel(seconds) {
  const timeUnits = [
    { unit: 604800, label: t('Weeks') },
    { unit: 86400, label: t('Days') },
    { unit: 3600, label: t('Hours') },
    { unit: 60, label: t('Minutes') },
    { unit: 1, label: t('Seconds') }
  ]
  for (let { unit, label } of timeUnits) {
    if (seconds >= unit) {
      return `${seconds / unit} ${label}`
    }
  }
}

const intervalOptions = computed(() => {
  const intervals = [600, 1800, 3600, 7200, 10800, 43200, 86400, 172800, 259200, 604800]
  return intervals.map((value) => ({
    value,
    label: formatUnitLabel(value)
  }))
})

const ACard = createAsyncComponent(import('ant-design-vue'), 'Card')
const store = useMainStore()
const { serverList } = storeToRefs(store)
const { serverReactive } = inject('GlobalProvide')
const TimerServerOptions = computed(() => {
  const options = serverList.value.map((item) => {
    const name = item.Name
    const obj = { value: name, label: item.ServerName ? item.ServerName : name }
    if (name === 'Nginx') {
      obj.disabled = true
    }
    return obj
  })
  options.unshift({ label: t('Website') + ' PHP-FPM', value: 'PHP-FPM' })
  return options
})

onMounted(async () => {
  if (serverList?.value?.length > 0 && Settings.get('AutoTimerRestartServer') && Settings.get('AutoTimerServerList')) {
    setRestartTimer()
  }
})

const restartServer = async () => {
  const initServerStatus = async (item) => {
    const processList = Settings.get('AutoTimerServerList')
    if (processList.length > 0 && processList.includes(item.Name)) serverReactive.restartFn(item.Name)
  }

  const promiseArray = serverList.value.map((item) => initServerStatus(item))
  await Promise.all(promiseArray)
}

// 定时器管理
let restartTimer = null

const setRestartTimer = () => {
  if (restartTimer) {
    clearInterval(restartTimer)
  }
  if (store.settings.AutoTimerRestartServer && store.settings.AutoTimerInterval) {
    restartTimer = setInterval(() => {
      restartServer()
    }, store.settings.AutoTimerInterval * 1000)
  }
}

// 重设定重启间隔时自动更新定时器
watch(() => store.settings.AutoTimerInterval, setRestartTimer)

watch(() => store.settings.AutoTimerRestartServer, setRestartTimer)

const AutoTimerServerChange = () => {
  store.setSettings('AutoTimerServerList')
}

const changeAutoTimerInterval = () => {
  store.setSettings('AutoTimerInterval')
}

const changeAutoTimerRestartServer = () => {
  store.setSettings('AutoTimerRestartServer')
  setRestartTimer()
}
</script>

<style scoped></style>
