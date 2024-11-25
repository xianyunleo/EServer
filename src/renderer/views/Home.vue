<template>
  <div class="content-container">
    <a-card :title="t('ShortcutActions')" size="small">
      <div class="quick-card-content">
        <a-button type="primary" @click="oneClickStart" :disabled="!!serverTableLoading">
          {{ mt('OneClick', 'ws', 'Start') }}
        </a-button>
        <a-button type="primary" @click="oneClickStop" :disabled="!!serverTableLoading">
          {{ mt('OneClick', 'ws', 'Stop') }}
        </a-button>
        <a-button type="primary" @click="corePathClick"> {{ APP_NAME }} {{ mt('ws', 'Directory') }}</a-button>
        <a-button type="primary" @click="wwwPathClick">{{ mt('Website', 'ws', 'Directory') }}</a-button>
      </div>
    </a-card>

    <a-table
      :columns="columns"
      :data-source="serverList"
      class="content-table"
      :pagination="false"
      size="middle"
      :loading="serverTableLoading"
      :scroll="{ y: 'calc(100vh - 220px)' }"
    >
      <template #bodyCell="{ column, record : item }">
        <template v-if="column.dataIndex === 'name'">
          <div>{{ item.ServerName ? item.ServerName : item.Name }}</div>
        </template>
        <template v-if="column.dataIndex === 'status'">
          <div style="font-size: 20px">
            <RightSquareFilled class="status-stop" v-if="!item.isRunning" />
            <RightSquareFilled class="status-start" v-if="item.isRunning" />
          </div>
        </template>

        <template v-if="column.dataIndex === 'operate'">
          <div class="operate-td">
            <a-button type="primary" @click="startServerClick(item)" v-if="!item.isRunning" :loading="item.btnLoading">
              <template #icon>
                <PoweroffOutlined />
              </template>
              {{ t('Start') }}
            </a-button>
            <a-button type="primary" @click="stopServerClick(item)" v-if="item.isRunning" :loading="item.btnLoading">
              <template #icon>
                <PoweroffOutlined />
              </template>
              {{ t('Stop') }}
            </a-button>
            <a-button type="primary" @click="restartServerClick(item)" :loading="item.btnLoading" :disabled="!item.isRunning">
              <template #icon>
                <ReloadOutlined />
              </template>
              {{ t('Restart') }}
            </a-button>
            <a-dropdown :trigger="['click']">
              <template #overlay>
                <a-menu>
                  <a-menu-item @click="openInstallDir(item)" key="999">
                    {{ mt('Open', 'ws', 'Directory') }}
                  </a-menu-item>
                  <a-menu-item v-if="item.ConfPath" @click="openConfFile(item)" key="998">
                    {{ mt('Open', 'ws') }}{{ Path.GetBaseName(item.ConfPath) }}
                  </a-menu-item>
                  <a-menu-item v-if="item.ServerConfPath" @click="openServerConfFile(item)" key="997">
                    {{ mt('Open', 'ws') }}{{ Path.GetBaseName(item.ServerConfPath) }}
                  </a-menu-item>
                  <a-menu-item v-for="(item, i) in item.ExtraFiles" :key="i" @click="openExtraFile(item, item)">
                    {{ mt('Open', 'ws') }}{{ item.Name }}
                  </a-menu-item>
                </a-menu>
              </template>
              <a-button>{{ t('Manage') }}<DownOutlined /></a-button>
            </a-dropdown>
          </div>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup>
import { inject, onMounted, ref, watch} from 'vue'
import { useMainStore } from '@/renderer/store'
import GetPath from '@/shared/utils/GetPath'
import GetAppPath from '@/main/utils/GetAppPath'
import Software from '@/main/core/software/Software'
import ServerControl from '@/main/core/ServerControl'
import MessageBox from '@/renderer/utils/MessageBox'
import { storeToRefs } from 'pinia/dist/pinia'
import { APP_NAME } from '@/shared/utils/constant'
import Native from '@/main/utils/Native'
import { sleep } from '@/shared/utils/utils'
import Path from '@/main/utils/Path'
import ProcessExtend from '@/main/utils/ProcessExtend'
import Settings from '@/main/Settings'
import SoftwareExtend from '@/main/core/software/SoftwareExtend'
import TcpProcess from '@/main/utils/TcpProcess'
import { devConsoleLog,isWindows } from '@/main/utils/utils'
import { createAsyncComponent } from '@/renderer/utils/utils'
import { mt, t } from '@/renderer/utils/i18n'

const timestamp = new Date().getTime()

const serverTableLoading = ref(false)
const { serverReactive } = inject('GlobalProvide')
serverReactive.restartFn = restartFn
serverReactive.isRunningFn = isRunningFn

const AButton = createAsyncComponent(import('ant-design-vue'), 'Button')
const ADropdown = createAsyncComponent(import('ant-design-vue'), 'Dropdown')
const DownOutlined = createAsyncComponent(import('@ant-design/icons-vue'), 'DownOutlined')
const PoweroffOutlined = createAsyncComponent(import('@ant-design/icons-vue'), 'PoweroffOutlined')
const ReloadOutlined = createAsyncComponent(import('@ant-design/icons-vue'), 'ReloadOutlined')
const RightSquareFilled = createAsyncComponent(import('@ant-design/icons-vue'), 'RightSquareFilled')

const columns = [
  {
    title: t('Name'),
    width: 180,
    dataIndex: 'name'
  },
  {
    title: t('Status'),
    dataIndex: 'status',
    width: 100,
    align: 'center'
  },
  {
    title: t('Operation'),
    dataIndex: 'operate',
    align: 'center'
  }
]

const store = useMainStore()
const { serverList, afterOpenAppStartServerMark } = storeToRefs(store)

onMounted(async () => {
  devConsoleLog('Home onMounted ms:', () => (new Date().getTime()) - timestamp)

  if (serverList?.value?.length > 0) {
    serverTableLoading.value = { tip: `${t('RefreshingServer')}...` }
    await initServerListStatus()
    serverTableLoading.value = false
  }

  if (Settings.get('AfterOpenAppStartServer') && afterOpenAppStartServerMark.value) {
    afterOpenAppStartServerMark.value = false
    oneClickStart()
  }
})

const getProcessList = async () => {
  let list
  const options = { directory: GetPath.getSoftwareDir() }
  if (isWindows) {
    list = await window.api.callStatic('ProcessLibrary', 'getList', options)
  } else {
    list = await ProcessExtend.getList(options)
  }
  //过滤掉子进程，剔除子进程
  let newList = []
  for (const item of list) {
    if (!list.find((item2) => item2.pid === item.ppid)) {
      newList.push([item.path, item.pid])
    }
  }
  return newList
}

const initServerListStatus = async () => {
  const processList = await getProcessList()
  const processMap = new Map(processList)

  const initServerStatus = async (item) => {
    const itemProcessPath = Software.getServerProcessPath(item)
    const pid = processMap.get(itemProcessPath)
    item.isRunning = !!pid
    item.pid = pid ?? null
  }

  const promiseArray = serverList.value.map((item) => initServerStatus(item))
  await Promise.all(promiseArray)
}

const corePathClick = () => {
  Native.openDirectory(GetAppPath.getUserCoreDir())
}
const wwwPathClick = () => {
  Native.openDirectory(GetPath.getWebsiteDir())
}

const openInstallDir = (item) => {
  Native.openDirectory(Software.getPath(item))
}

const openConfFile = (item) => {
  Native.openTextFile(Software.getConfPath(item))
}

const openServerConfFile = (item) => {
  Native.openTextFile(Software.getServerConfPath(item))
}

const openExtraFile = (item, extraFile) => {
  Native.openTextFile(Path.Join(Software.getPath(item), extraFile.Path))
}

const getNginxRequirePhpList = async () => {
  const list = await SoftwareExtend.getNginxRequirePhpList()
  return list.map((item) => `PHP-${item}`)
}

const oneClickStart = async () => {
  const oneClickServerList = Settings.get('OneClickServerList')
  const websitePhpFpmSwitch = oneClickServerList.includes('PHP-FPM')
  const requirePhpList = await getNginxRequirePhpList()
  const doStartServerClick = async (item) => {
    if (oneClickServerList.includes(item.Name)) {
      startServerClick(item)
    } else if (item.Name.match(/^PHP-[.\d]+$/) && requirePhpList.includes(item.Name) && websitePhpFpmSwitch) {
      //自动判断网站列表的PHP-FPM
      startServerClick(item)
    }
  }

  for (const item of serverList.value) {
    doStartServerClick(item)
  }
}

const oneClickStop = async () => {
  const oneClickServerList = Settings.get('OneClickServerList')
  const websitePhpFpmSwitch = oneClickServerList.includes('PHP-FPM')
  const requirePhpList = await getNginxRequirePhpList()
  const doStopServerClick = async (item) => {
    if (oneClickServerList.includes(item.Name)) {
      stopServerClick(item)
    } else if (item.Name.match(/^PHP-[.\d]+$/) && requirePhpList.includes(item.Name) && websitePhpFpmSwitch) {
      //自动判断网站列表的PHP-FPM
      stopServerClick(item)
    }
  }

  for (const item of serverList.value) {
    doStopServerClick(item)
  }
}

const startServerClick = async (item) => {
  if (item.isRunning || item.btnLoading) {
    return
  }
  item.btnLoading = true
  try {
    if (item.ServerPort) {
      if (item.ServerPort == 80) {
        await ProcessExtend.killWebServer()
      } else {
        const pid = await TcpProcess.getPidByPort(item.ServerPort)
        if (pid) await ProcessExtend.kill(pid)
      }
    }

    await ServerControl.start(item)
    if (!item.unwatch) {
      item.unwatch = watch(
        () => item.errMsg,
        (errMsg) => {
          if (errMsg) {
            MessageBox.error(errMsg, t('Error starting service!'))
          }
        }
      )
    }
  } catch (error) {
    MessageBox.error(error.message ?? error, t('Error starting service!'))
  }
  item.btnLoading = false
}

async function restartServerClick(item, callback = null) {
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
  } catch (error) {
    MessageBox.error(error.message ?? error, t('Error starting service!'))
  }
  item.btnLoading = false
}

const stopServerClick = async (item) => {
  if (!item.isRunning) {
    return
  }
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
  } catch (error) {
    MessageBox.error(error.message ?? error, t('Error stopping service!'))
  }
  item.btnLoading = false
}

function isRunningFn(name) {
  const item = serverList.value.find((item) => item.Name === name)
  return item && item.isRunning
}

async function restartFn(name) {
  const item = serverList.value.find((item) => item.Name === name)
  if (item) await restartServerClick(item)
}
</script>

<style scoped lang="less">
@import '@/renderer/assets/css/var';

:deep(td) {
  height: 57px;
}

.status-start {
  color: @colorSuccessActive;
}

.status-stop {
  color: @colorErrorActive;
}

.quick-card-content {
  height: calc(@controlHeight * 1px);
  display: flex;
  justify-content: space-around;
}

.operate-td {
  display: flex;
  justify-content: space-evenly;
}
</style>
