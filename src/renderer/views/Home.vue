<template>
  <div class="content-container">
    <a-card :title="t('ShortcutActions')" size="small">
      <div class="quick-card-content">
        <a-button type="primary" @click="HomeService.oneClickStart" :disabled="!!serverTableLoading">
          {{ mt('OneClick', 'ws', 'Start') }}
        </a-button>
        <a-button type="primary" @click="HomeService.oneClickStop" :disabled="!!serverTableLoading">
          {{ mt('OneClick', 'ws', 'Stop') }}
        </a-button>
        <a-button type="primary" @click="dataDirClick"> {{ APP_NAME }} {{ mt('ws', 'Directory') }}</a-button>
        <a-button type="primary" @click="cfgPathClick">{{ mt('Config', 'ws', 'Directory') }}</a-button>
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
          <div>{{ item.ServerName ? item.ServerName : item.Name }}
            <a-tag v-if="item.IsCustom">{{t('Custom')}}</a-tag>
          </div>
        </template>
        <template v-if="column.dataIndex === 'status'">
          <div style="font-size: 20px">
            <RightSquareFilled class="status-stop" v-if="!item.isRunning" />
            <RightSquareFilled class="status-start" v-if="item.isRunning" />
          </div>
        </template>

        <template v-if="column.dataIndex === 'operate'">
          <div class="operate-td">
            <a-button type="primary" @click="HomeService.startServerClick(item)"
                      v-if="!item.isRunning" :loading="item.btnLoading">
              <template #icon>
                <PoweroffOutlined />
              </template>
              {{ t('Start') }}
            </a-button>
            <a-button type="primary" @click="HomeService.stopServerClick(item)"
                      v-if="item.isRunning" :loading="item.btnLoading">
              <template #icon>
                <PoweroffOutlined />
              </template>
              {{ t('Stop') }}
            </a-button>
            <a-button type="primary" @click="HomeService.restartServerClick(item)"
                      :loading="item.btnLoading" :disabled="!item.isRunning">
              <template #icon>
                <ReloadOutlined />
              </template>
              {{ t('Restart') }}
            </a-button>
            <a-dropdown :trigger="['click']">
              <template #overlay>
                <a-menu>
                  <a-menu-item @click="openWorkDir(item)" key="999">
                    {{ mt('Open', 'ws', 'Directory') }}
                  </a-menu-item>
                  <a-menu-item v-if="item.ConfPath" @click="openConfFile(item)" key="998">
                    {{ mt('Open', 'ws') }}{{ path.basename(item.ConfPath) }}
                  </a-menu-item>
                  <a-menu-item v-if="item.ServerConfPath" @click="openServerConfFile(item)" key="997">
                    {{ mt('Open', 'ws') }}{{ path.basename(item.ServerConfPath) }}
                  </a-menu-item>
                  <a-menu-item v-for="item2 in item.ExtraFiles" @click="openExtraFile(item, item2)">
                    {{ mt('Open', 'ws') }}{{ item2.Name }}
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
import { onMounted, ref} from 'vue'
import { useMainStore } from '@/renderer/store'
import GetDataPath from '@/shared/utils/GetDataPath'
import ChildApp from '@/main/core/childApp/ChildApp'
import { storeToRefs } from 'pinia/dist/pinia'
import { APP_NAME } from '@/shared/utils/constant'
import Native from '@/renderer/utils/Native'
import path from 'path'
import ProcessExtend from '@/main/utils/ProcessExtend'
import HomeService from '@/renderer/services/HomeService'
import { isWindows } from '@/main/utils/utils'
import { createAsyncComponent } from '@/renderer/utils/utils'
import { mt, t } from '@/renderer/utils/i18n'
import { StoreInitializedEventName } from '@/renderer/utils/constant'
import Settings from '@/main/Settings'
import CustomChildApp from '@/main/core/childApp/CustomChildApp'
import FsUtil from '@/main/utils/FsUtil'

const timestamp = new Date().getTime()

const serverTableLoading = ref(false)

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
const { serverList } = storeToRefs(store)

window.addEventListener(StoreInitializedEventName, async () => {
  loadingHandle().then(() => {
    store.Home.firstLoadingHandled = true
    //“打开软件后，启动服务”功能，必须等待读取server列表状态。避免server真实状态是“启动”，重复启动软件。
    if (Settings.get('AfterOpenAppStartServer')) {
      HomeService.oneClickStart()
    }
  })
})

onMounted(async () => {
  console.log('Home onMounted ms:', (new Date().getTime()) - timestamp)
  //devConsoleLog('Home onMounted ms:', () => (new Date().getTime()) - timestamp)
  if (store.Home.firstLoadingHandled){
    loadingHandle()
  }
})

const loadingHandle = async () => {
  serverTableLoading.value = { tip: `${t('RefreshingServer')}...` }
  await initServerListStatus()
  serverTableLoading.value = false
}

const getProcessList = async () => {
  let list
  const options = { directory: GetDataPath.getChildAppDir(), pathList: await CustomChildApp.getServerProcessPathList() }
  if (isWindows) {
    list = await window.api.callStatic('ProcessLibrary', 'getList', options)
  } else {
    list = await ProcessExtend.getList(options)
  }
  //过滤掉子进程。防止先匹配到子进程后， 子进程停止整个服务失败。
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
    const servPath = item.IsCustom ? await FsUtil.ParseSymbolicLink(path.normalize(item.ServerProcessPath)) : ChildApp.getServerProcessPath(item)
    const pid = processMap.get(servPath)
    item.isRunning = !!pid
    item.pid = pid ?? null
  }

  const promiseArray = serverList.value.map((item) => initServerStatus(item))
  await Promise.all(promiseArray)
}

const dataDirClick = () => Native.openDirectory(GetDataPath.getDir())
const cfgPathClick = () => Native.openDirectory(GetDataPath.getEtcDir())
const openWorkDir = (item) => {
  const p = item.IsCustom ?  path.dirname(item.ServerProcessPath) :ChildApp.getDir(item)
  Native.openDirectory(p)
}

const openConfFile = (item) => {
  const p = item.IsCustom ? item.ConfPath : ChildApp.getConfPath(item)
  Native.openTextFile(p)
}
const openServerConfFile = (item) => {
  const p = item.IsCustom ? item.ServerConfPath : ChildApp.getServerConfPath(item)
  Native.openTextFile(p)
}
const openExtraFile = (item, extraFile) => {
  const p = item.IsCustom ? extraFile.Path : ChildApp.getCommonPath(item, extraFile.Path)
  Native.openTextFile(p)
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
