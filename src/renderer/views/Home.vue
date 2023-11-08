<template>
  <div class='content-container'>
    <a-card :title='t("ShortcutActions")' size="small">
      <div class='quick-card-content'>
        <a-button type='primary' @click='oneClickStart' :disabled='!!serverTableLoading'>
          {{ mt('OneClick', 'ws', 'Start') }}
        </a-button>
        <a-button type='primary' @click='oneClickStop' :disabled='!!serverTableLoading'>
          {{ mt('OneClick', 'ws', 'Stop') }}
        </a-button>
        <a-button type='primary' @click='corePathClick'>
          {{ APP_NAME }} {{ mt('ws', 'Directory') }}
        </a-button>
        <a-button type='primary' @click='wwwPathClick'>
          {{ mt('Website', 'ws', 'Directory') }}
        </a-button>
      </div>
    </a-card>

    <a-table :columns='columns' :data-source='serverList' class='content-table' :pagination='false' size='middle'
             :loading='serverTableLoading' :scroll="{y: 'calc(100vh - 240px)'}">
      <template #bodyCell='{ column, record}'>
        <template v-if="column.dataIndex === 'name'">
          <div>
            {{ record.ServerName ? record.ServerName : record.Name }}
          </div>
        </template>
        <template v-if="column.dataIndex === 'status'">
          <div style='font-size: 20px;'>
            <RightSquareFilled class='status-stop' v-if='!record.isRunning' />
            <RightSquareFilled class='status-start' v-if='record.isRunning' />
          </div>
        </template>

        <template v-if="column.dataIndex === 'operate'">
          <div class='operate-td'>
            <a-button type='primary' @click='startServerClick(record)' v-if='!record.isRunning'
                      :loading='record.btnLoading'>
              <template #icon>
                <PoweroffOutlined />
              </template>
              {{t("Start")}}
            </a-button>
            <a-button type='primary' @click='stopServerClick(record)' v-if='record.isRunning'
                      :loading='record.btnLoading'>
              <template #icon>
                <PoweroffOutlined />
              </template>
              {{t("Stop")}}
            </a-button>
            <a-button type='primary' @click='restartServerClick(record)'
                      :loading='record.btnLoading' :disabled='!record.isRunning'>
              <template #icon>
                <ReloadOutlined />
              </template>
              {{t("Restart")}}
            </a-button>
            <a-dropdown :trigger="['click']">
              <template #overlay>
                <a-menu>
                  <a-menu-item @click='openInstallDir(record)' key='999'>
                    {{ mt('Open','ws','Directory') }}
                  </a-menu-item>
                  <a-menu-item v-if='record.ConfPath' @click='openConfFile(record)' key='998'>
                    {{ mt('Open','ws') }}{{ Path.GetBaseName(record.ConfPath) }}
                  </a-menu-item>
                  <a-menu-item v-if='record.ServerConfPath' @click='openServerConfFile(record)' key='997'>
                    {{ mt('Open','ws') }}{{ Path.GetBaseName(record.ServerConfPath) }}
                  </a-menu-item>
                  <a-menu-item v-for='(item,i) in record.ExtraFiles' :key='i' @click='openExtraFile(record,item)'>
                    {{ mt('Open','ws') }}{{ item.Name }}
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
var timestamp = new Date().getTime();
import {computed, defineAsyncComponent, inject, onMounted, ref, watch} from 'vue'
import { useMainStore } from '@/renderer/store'
import App from '@/main/App'
import GetPath from '@/shared/utils/GetPath'
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
import { mt, t } from '@/shared/utils/i18n'

const serverTableLoading = ref(false)
let { globalReactive, serverReactive } = inject('GlobalProvide')
serverReactive.restartFn = restartServerClick
serverReactive.startPhpFpmFn = startPhpFpm

const DownOutlined = defineAsyncComponent(() => {
  return new Promise((resolve) => {
    import('@ant-design/icons-vue').then((modules) => {
      resolve(modules.DownOutlined)
    })
  })
})
const PoweroffOutlined = defineAsyncComponent(() => {
  return new Promise((resolve) => {
    import('@ant-design/icons-vue').then((modules) => {
      resolve(modules.PoweroffOutlined)
    })
  })
})
const ReloadOutlined = defineAsyncComponent(() => {
  return new Promise((resolve) => {
    import('@ant-design/icons-vue').then((modules) => {
      resolve(modules.ReloadOutlined)
    })
  })
})
const RightSquareFilled = defineAsyncComponent(() => {
  return new Promise((resolve) => {
    import('@ant-design/icons-vue').then((modules) => {
      resolve(modules.RightSquareFilled)
    })
  })
})

const AButton = defineAsyncComponent(() => {
  return new Promise((resolve) => {
    import('ant-design-vue').then((modules) => {
      resolve(modules.Button)
    })
  })
})
const ADropdown = defineAsyncComponent(() => {
  return new Promise((resolve) => {
    import('ant-design-vue').then((modules) => {
      resolve(modules.Dropdown)
    })
  })
})
const AMenu = defineAsyncComponent(() => {
  return new Promise((resolve) => {
    import('ant-design-vue').then((modules) => {
      resolve(modules.Menu)
    })
  })
})
const AMenuItem = defineAsyncComponent(() => {
  return new Promise((resolve) => {
    import('ant-design-vue').then((modules) => {
      resolve(modules.MenuItem)
    })
  })
})
onMounted(() => {
  var timestamp2 = new Date().getTime();
  console.log('home onMounted',timestamp2-timestamp)
})
const columns = [
  {
    title: t('Name'),
    width: 180,
    dataIndex: 'name'
  }, {
    title: t('Status'),
    dataIndex: 'status',
    width: 100,
    align: 'center'
  }, {
    title:  t('Operation'),
    dataIndex: 'operate',
    align: 'center'
  }
]

const mainStore = useMainStore()
const { serverSoftwareList } = storeToRefs(mainStore)

const serverList = computed(() => serverSoftwareList.value.filter(item => Software.IsInstalled(item)))
//这里的nginxItem不能用 serverList find，因为第一次安装打开软件时，这里的serverList是空
if (!serverReactive.nginxItem) {
  serverReactive.nginxItem = serverSoftwareList.value.find(item => item.Name === 'Nginx')
}


const getProcessList = async () => {
  let list = await ProcessExtend.getList({ directory: GetPath.getSoftwareDir() })
  //过滤掉子进程，剔除子进程
  let newList = []
  for (const item of list) {
    if (!list.find(item2 => item2.pid === item.ppid)) {
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
    if (pid) {
      item.isRunning = true
      item.pid = pid
    } else {
      item.isRunning = false
      item.pid = null
    }
  }

  const promiseArray = serverList.value.map(item => initServerStatus(item))
  await Promise.all(promiseArray)
};

(async () => {
  if (serverList.value) {
    serverTableLoading.value = { tip: `${t('RefreshingServer')}...`}
    await initServerListStatus()
    serverTableLoading.value = false
  }
})()


const corePathClick = () => {
  Native.openDirectory(App.getUserCoreDir())
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
  return list.map(item => `PHP-${item}`)
}

const oneClickStart = async () => {
  const oneClickServerList = ref(Settings.get('OneClickServerList'))
  //oneClickServerIncludePhpFpm 基本上默认为true
  const oneClickServerIncludePhpFpm = oneClickServerList.value.includes('PHP-FPM')
  const requirePhpList = await getNginxRequirePhpList()
  const doStartServerClick = async (item) => {
    if (oneClickServerList.value.includes(item.Name)) {
      startServerClick(item)
    } else if (item.Name.match(/^PHP-[.\d]+$/) && requirePhpList.includes(item.Name) && oneClickServerIncludePhpFpm) {
      startServerClick(item)
    }
  }

  for (const item of serverList.value) {
    doStartServerClick(item)
  }
}

const oneClickStop = async () => {
  const oneClickServerList = ref(Settings.get('OneClickServerList'))
  //oneClickServerIncludePhpFpm 基本上默认为true
  const oneClickServerIncludePhpFpm = oneClickServerList.value.includes('PHP-FPM')
  const requirePhpList = await getNginxRequirePhpList()
  const doStopServerClick = async (item) => {
    if (oneClickServerList.value.includes(item.Name)) {
      stopServerClick(item)
    } else if (item.Name.match(/^PHP-[.\d]+$/) && requirePhpList.includes(item.Name) && oneClickServerIncludePhpFpm) {
      stopServerClick(item)
    }
  }

  for (const item of serverList.value) {
    doStopServerClick(item)
  }
}

const startServerClick = async (item) => {
  if (item.isRunning) {
    return
  }
  item.btnLoading = true
  try {
    if (item.ServerPort) {
      if (item.ServerPort == 80) {
        await ProcessExtend.killWebServer()
      } else {
        await TcpProcess.killByPort(item.ServerPort)
      }
    }

    await ServerControl.start(item)
    if (!item.unwatch) {
      item.unwatch = watch(() => item.errMsg, (errMsg) => {
        if (errMsg) {
          MessageBox.error(errMsg, '启动服务出错！')
        }
      })
    }
  } catch (error) {
    MessageBox.error(error.message ?? error, '启动服务出错！')
  }
  item.btnLoading = false
}

async function restartServerClick(item) {
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
      throw new Error('服务没有成功停止！')
    }

    await ServerControl.start(item)
  } catch (error) {
    MessageBox.error(error.message ?? error, '重启服务出错！')
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
    MessageBox.error(error.message ?? error, '停止服务出错！')
  }
  item.btnLoading = false
}

async function startPhpFpm(phpVersion) {
  let item = serverList.value.find(item => item.Name === `PHP-${phpVersion}`)
  if (item) {
    await startServerClick(item)
  }
}

</script>

<style scoped lang='less'>
@import "@/renderer/assets/css/var";


.status-start {
  color: @colorSuccessActive;
}

.status-stop {
  color: @colorErrorActive;
}


.quick-card-content {
  height: calc(@controlHeight * 1px);
  display: flex;
  justify-content: space-around
}

.log-card {
  margin-bottom: 10px;

  :deep(.ant-card-body) {
    height: 150px;
    padding: 12px 24px;
  }
}

.operate-td {
  display: flex;
  justify-content: space-evenly;
}
</style>
