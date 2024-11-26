<template>
  <a-card size="small" :title="t('Timer')" class="settings-card">
    <div class="settings-card-row flex-vertical-center">
      <a-switch v-model:checked="store.settings.AutoTimerRestartServer" class="settings-switch"
                @change="changeAutoTimerRestartServer" />
      <span>{{ t('ServerAutoRestartText') }}</span>
    </div>
    <div class="settings-card-row flex-vertical-center">
      <span :class="disabledTextClass()">{{ mt('Server', 'ws', 'List') }}：</span>
      <a-select
        v-model:value="store.settings.AutoTimerServerList"
        :options="timerServerOptions" :disabled="!store.settings.AutoTimerRestartServer"
        mode="multiple" style="flex: 1" :placeholder="t('pleaseChoose')"
        @change="AutoTimerServerChange"
      ></a-select>
    </div>

    <div class="settings-card-row flex-vertical-center">
      <span :class="disabledTextClass()">{{ t('RestartIntervalText') }}：</span>
      <a-select v-model:value="store.settings.AutoTimerInterval"
        :options="intervalOptions" :placeholder="t('pleaseChoose')" style="flex: 1"
        :disabled="!store.settings.AutoTimerRestartServer"
        @change="changeAutoTimerInterval"
      ></a-select>
    </div>
  </a-card>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useMainStore } from '@/renderer/store'
import { storeToRefs } from 'pinia'
import { mt, t } from '@/renderer/utils/i18n'
import { createAsyncComponent } from '@/renderer/utils/utils'
import TimerService from '@/renderer/services/TimerService'
import { isDev } from '@/main/utils/utils'

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
  if (isDev) intervals.unshift(10)
  return intervals.map((value) => ({
    value,
    label: formatUnitLabel(value)
  }))
})

const ACard = createAsyncComponent(import('ant-design-vue'), 'Card')
const store = useMainStore()
const { serverList } = storeToRefs(store)
const timerServerOptions = computed(() => {
  const options = serverList.value.map((item) => {
    const name = item.Name
    return { value: name, label: item.ServerName ? item.ServerName : name }
  })
  options.unshift({ label: t('Website') + ' PHP-FPM', value: 'PHP-FPM' })
  return options
})

// 重设定重启间隔时自动更新定时器
watch(() => store.settings.AutoTimerInterval, TimerService.setRestartTimer)

watch(() => store.settings.AutoTimerRestartServer, TimerService.setRestartTimer)

const AutoTimerServerChange = () => {
  store.setSettings('AutoTimerServerList')
}

const changeAutoTimerInterval = () => {
  store.setSettings('AutoTimerInterval')
}

const changeAutoTimerRestartServer = () => {
  store.setSettings('AutoTimerRestartServer')
  TimerService.setRestartTimer()
}

const disabledTextClass = () => !store.settings.AutoTimerRestartServer ? 'disabled-text' : ''
</script>

<style scoped></style>
