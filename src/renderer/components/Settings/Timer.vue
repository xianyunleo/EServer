<template>
  <a-card size="small" :title="t('Timer')" class="settings-card">
    <div class="settings-card-row flex-vertical-center">
      <a-tooltip>
        <template #title>{{ t('TimerServerList') }}</template>
        <span>{{ mt('Server', 'ws', 'List') }}：</span>
      </a-tooltip>

      <a-select
        v-model:value="store.settings.AutoTimerServerList"
        :options="TimerServerOptions" @change="AutoTimerServerChange"
        mode="multiple" placeholder="请选择" style="flex: 1"
      ></a-select>
    </div>

    <div class="interval-card-row flex-vertical-center">

      <a-tooltip>
        <template #title>{{ t('RestartIntervalText') }}</template>
        <span>{{ t('RestartIntervalText') }}：</span>
      </a-tooltip>

      <a-select v-model:value="store.settings.AutoTimerInterval" :options="intervalOptions" @change="changeAutoTimerInterval" placeholder="选择重启间隔" style="flex: 1"></a-select>
    </div>

    <div class="settings-card-row flex-vertical-center">
      <a-switch v-model:checked="store.settings.AutoTimerRestartServer" class="settings-switch"
                @change="changeAutoTimerRestartServer" />
      <span>{{ t('ServerAutoRestartText') }}</span>
    </div>

  </a-card>
</template>

<script setup>
import { useMainStore } from '@/renderer/store'
import { storeToRefs } from 'pinia'
import { mt, t } from '@/renderer/utils/i18n'
import { createAsyncComponent } from '@/renderer/utils/utils'
import ServerControl from '@/main/core/ServerControl'
import ProcessExtend from '@/main/utils/ProcessExtend'
import Settings from '@/main/Settings'
import { sleep } from '@/shared/utils/utils'
import { computed, watch, onMounted} from 'vue'

const intervalOptions = [
  { value: 600, label: '10分钟' },
  { value: 1800, label: '30分钟' },
  { value: 3600, label: '1小时' },
  { value: 7200, label: '2小时' },
  { value: 10800, label: '6小时' },
  { value: 43200, label: '12小时' },
  { value: 86400, label: '1天' },
  { value: 172800, label: '2天' },
  { value: 259200, label: '3天' },
  { value: 604800, label: '1周' }
]

const ACard = createAsyncComponent(import('ant-design-vue'), 'Card')
const store = useMainStore()
const { serverList } = storeToRefs(store)
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
  var timestamp = new Date()
  console.log('Timer onMounted', timestamp)

  if (serverList?.value?.length > 0 && Settings.get('AutoTimerRestartServer') && Settings.get('AutoTimerServerList')) {
    setRestartTimer()
  }
})

const restartServer = async () => {
  const initServerStatus = async (item) => {
    const processList = Settings.get('AutoTimerServerList')
    if (processList.length > 0 && processList.includes(item.Name)) restartServerItem(item)
  }

  const promiseArray = serverList.value.map((item) => initServerStatus(item))
  await Promise.all(promiseArray)
}

async function restartServerItem(item) {
  item.btnLoading = true
  try {
    await ServerControl.stop(item)

    for (let i = 0; i < 10; i++) {
      if (item.isRunning === false) {
        break
      }
      await sleep(500)
      item.isRunning = ProcessExtend.pidIsRunning(item.pid)
    }

    if (item.isRunning) {
      throw new Error(t('The service was not stopped successfully!'))
    }

    await ServerControl.start(item)

    console.log(`[Timer] ${item.Name} is restarting at ${new Date()}`)
  } catch (error) {
    console.error(t('Error starting service!'))
  }
  item.btnLoading = false
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
