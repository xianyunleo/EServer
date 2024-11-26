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
import { onMounted, ref} from 'vue'
import { useMainStore } from '@/renderer/store'
import GetPath from '@/shared/utils/GetPath'
import GetAppPath from '@/main/utils/GetAppPath'
import Software from '@/main/core/software/Software'
import { storeToRefs } from 'pinia/dist/pinia'
import { APP_NAME } from '@/shared/utils/constant'
import Native from '@/main/utils/Native'
import Path from '@/main/utils/Path'
import ProcessExtend from '@/main/utils/ProcessExtend'
import HomeService from '@/renderer/services/HomeService'
import { devConsoleLog,isWindows } from '@/main/utils/utils'
import { createAsyncComponent } from '@/renderer/utils/utils'
import { mt, t } from '@/renderer/utils/i18n'
import { StoreInitializedEventName } from '@/renderer/utils/constant'

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
  console.log('Listened StoreInitializedEvent')
  if (serverList?.value?.length > 0) {
    serverTableLoading.value = { tip: `${t('RefreshingServer')}...` }
    await initServerListStatus()
    serverTableLoading.value = false
  }
})

onMounted(async () => {
  devConsoleLog('Home onMounted ms:', () => (new Date().getTime()) - timestamp)
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
