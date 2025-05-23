<template>
  <div class="content-container">
    <div class="category">
      <a-radio-group v-model:value="proxyObj.selectedType" button-style="solid" @change="radioGroupChange">
        <a-radio-button :value="InstalledType">{{ t('Installed') }}</a-radio-button>
        <a-radio-button :value="ChildAppTypes.Server">{{ t('Server') }} </a-radio-button>
        <a-radio-button :value="ChildAppTypes.PHP">PHP</a-radio-button>
        <a-radio-button :value="ChildAppTypes.Tool">{{ t('Tool') }}</a-radio-button>
      </a-radio-group>
    </div>

    <div class="app-list piece">
      <div class="app-head">
        <div class="app-item">
          <div class="app-item-content">
            <div class="app-item-avatar">
              <span></span>
            </div>
            <div class="app-item-title">{{ t('Name') }}</div>
            <div class="app-item-desc">{{ t('Desc') }}</div>
            <div class="app-item-operate">{{ t('Operation') }}</div>
          </div>
        </div>
      </div>

      <div class="app-body">
        <template v-for="item in childAppList" :key="item.Name">
          <div v-if="item.show" class="app-item">
            <div class="app-item-content">
              <div class="app-item-avatar">
                <img :src="item.Icon" />
              </div>
              <div class="app-item-title">{{ item.Name }}</div>
              <div class="app-item-desc">{{ t(item.Desc) }}</div>
              <div class="app-item-operate">
                <template v-if="item.Installed">
                  <a-button type="primary" danger style="margin-right: 5px" :disabled="item.CanDelete === false" @click="uninstall(item.Name)">{{ t('Uninstall') }} </a-button>

                  <a-dropdown :trigger="['click']">
                    <template #overlay>
                      <a-menu>
                        <a-menu-item v-if="item.CanOpen" @click="openApp(item)">{{ t('Open') }}</a-menu-item>
                        <a-menu-item @click="openInstallPath(item)">{{ mt('Open', 'ws', 'Directory') }}</a-menu-item>
                        <a-menu-item v-if="item.ConfPath" @click="openConfFile(item)" key="998"> {{ mt('Open', 'ws') }}{{ path.basename(item.ConfPath) }} </a-menu-item>
                        <a-menu-item v-if="item.ServerConfPath" @click="openServerConfFile(item)" key="997">
                          {{ mt('Open', 'ws') }}{{ path.basename(item.ServerConfPath) }}
                        </a-menu-item>
                        <a-menu-item v-if="item.Type === ChildAppTypes.PHP" @click="showPhpExtManager(item)">
                          {{ mt('Install', 'ws', 'Extension') }}
                        </a-menu-item>
                      </a-menu>
                    </template>
                    <a-button>{{ t('Manage') }}<DownOutlined /></a-button>
                  </a-dropdown>
                </template>
                <template v-else>
                  <a-button v-if="instMap[item.Name] && !instMap[item.Name].errMsg" type="primary" @click="clickStop(item.Name)">{{ t('Stop') }} </a-button>
                  <a-button v-else type="primary" @click="clickInstall(item.Name)">{{ t('Install') }}</a-button>
                </template>
              </div>
            </div>
            <!-- 安装下载-->
            <div v-if="instMap[item.Name]" class="app-item-progress">
              <a-progress :percent="instMap[item.Name]?.percent" :show-info="false" status="active" />
              <div class="progress-info">
                <div v-if="instMap[item.Name]?.errMsg" class="status-text-error">
                  <a-tooltip>
                    <template #title>{{ instMap[item.Name]?.errMsg }}</template>
                    {{ instMap[item.Name]?.errMsg }}
                  </a-tooltip>
                </div>
                <template v-else>
                  <div class="progress-info-left">
                    <span v-if="instMap[item.Name]?.status === InstStatus.Downloading"> {{ instMap[item.Name]?.receivedSizeText }}/{{ instMap[item.Name]?.totalSizeText }} </span>
                  </div>
                  <div class="progress-info-right">
                    <span v-if="instMap[item.Name]?.status === InstStatus.Downloading"> ↓ {{ instMap[item.Name]?.perSecondText }}/S </span>
                    <span v-else>{{ instMap[item.Name]?.statusText }}</span>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <a-card size="small">
      <div class="local-install">
        <a-button type="primary" :icon="h(AppstoreAddOutlined)" @click="localInstall">
          {{ mt('Local', 'ws', 'Install') }}
        </a-button>
        <span>{{ t('installPackageDownloadUrl') }}:</span>
        <a @click="openUrl('http://github.com/xianyunleo/EServerAppStore')">Github</a>
        <a @click="openUrl('https://gitee.com/xianyunleo/EServerAppStore')">Gitee</a>
      </div>
    </a-card>
  </div>

  <!--  v-if防止不显示就执行modal里面的代码-->
  <php-ext-manager v-if="phpExtManagerShow" v-model:show="phpExtManagerShow" :phpVersion="phpVersion"></php-ext-manager>
</template>

<script setup>
import { h, reactive, ref } from 'vue'
import { useMainStore } from '@/renderer/store'
import { storeToRefs } from 'pinia'
import { message } from 'ant-design-vue'
import { EnumChildAppInstallStatus } from '@/shared/utils/enum'
import { AppstoreAddOutlined, DownOutlined } from '@ant-design/icons-vue'
import ChildApp from '@/main/services/childApp/ChildApp'
import MessageBox from '@/renderer/utils/MessageBox'
import { getFileSizeText, getIpcError } from '@/shared/utils/utils'
import Opener from '@/renderer/utils/Opener'
import PhpExtManager from '@/renderer/components/ChildApp/PhpExtManager.vue'
import ChildAppExtend from '@/main/services/childApp/ChildAppExtend'
import path from 'path'
import { mt, t } from '@/renderer/utils/i18n'
import { isMacOS, isWindows } from '@/main/utils/utils'
import LocalInstall from '@/main/services/childApp/LocalInstall'
import { createAsyncComponent } from '@/renderer/utils/utils'
import SystemExtend from '@/main/utils/SystemExtend'
import { ChildAppTypes } from '@/main/utils/constant'
import Ipc from '@/renderer/utils/Ipc'
const callStatic = Ipc.callStatic
const InstalledType = 'InstalledType'
const AButton = createAsyncComponent(import('ant-design-vue'), 'Button')
const ADropdown = createAsyncComponent(import('ant-design-vue'), 'Dropdown')

const store = useMainStore()
const phpExtManagerShow = ref(false)
const phpVersion = ref('')
const InstStatus = EnumChildAppInstallStatus

const childAppList = store.childAppList
const proxyObj = store.ChildApp
const instMap = proxyObj.installInfoMap

if (!proxyObj.selectedType) {
  proxyObj.selectedType = InstalledType
}

const setShowList = (type) => {
  for (const item of childAppList) {
    if (type === InstalledType) {
      item.show = item.Installed === true
    } else {
      item.show = type === item.Type
    }
  }
}

setShowList(proxyObj.selectedType)

const radioGroupChange = () => {
  setShowList(proxyObj.selectedType)
}

const getStatusText = (status) => {
  switch (status) {
    case InstStatus.Ready:
      return t('Ready')
    case InstStatus.Downloading:
      return t('Downloading')
    case InstStatus.Extracting:
      return t('Unzipping')
    case InstStatus.Configuring:
      return t('Configuring')
    default:
      return ''
  }
}

const findItem = (name) => childAppList.find((item) => item.Name === name)

const clickInstall = async (name) => {
  instMap[name] = reactive({})
  Ipc.call('childAppInstall', name).catch(() => {})
}

Ipc.on('childApp-downloadProgress', (name, progress) => {
  instMap[name] = Object.assign(instMap[name], {
    status: InstStatus.Downloading,
    receivedBytes: progress.receivedBytes,
    receivedSizeText: getFileSizeText(progress.receivedBytes),
    totalSizeText: getFileSizeText(progress.totalBytes),
    perSecondText: getFileSizeText(progress.perSecondBytes),
    percent: parseInt((progress.receivedBytes / progress.totalBytes) * 100)
  })
})

if (!proxyObj.listened) {
  proxyObj.listened = true
  Ipc.onGlobal('childApp-installStatus', (name, status) => {
    const statusText = getStatusText(status)
    instMap[name] = Object.assign(instMap[name], { status, statusText })
    if (status === InstStatus.Downloaded) {
      instMap[name].percent = 100
    } else if (status === InstStatus.Finish) {
      instMap[name] = null
      findItem(name).Installed = true
      store.refreshInstalledList()
    }
  })

  Ipc.onGlobal('childApp-downloadCancelled', (name) => {
    //如果不是点击clickStop的取消
    if (instMap[name]) {
      instMap[name].errMsg = `${t('errorOccurredDuring', [t('download')])}，${mt('Network', 'ws', 'Error')}`
    }
  })

  Ipc.onGlobal('childApp-installError', (name, errMsg) => {
    instMap[name].errMsg = errMsg
  })
}

const clickStop = (name) => {
  instMap[name] = null
  Ipc.call('childAppStopInstall', name)
}

const openApp = (item) => {
  let appPath
  if (isWindows) {
    appPath = ChildApp.getCommonPath(item, item.ProcessPath)
  } else if (isMacOS) {
    appPath = ChildApp.getDir(item)
  }
  Opener.openApp(appPath)
}

const openInstallPath = async (item) => {
  let path = item.IsMacApp ? ChildApp.getTypeDir(item.Type) : ChildApp.getDir(item)
  Opener.openDirectory(path)
}

const openConfFile = (item) => Opener.openTextFile(ChildApp.getConfPath(item))
const openServerConfFile = (item) => Opener.openTextFile(ChildApp.getServerConfPath(item))

const uninstall = async (name) => {
  const item = findItem(name)
  try {
    const res = await Ipc.call('childAppUninstall', name)
    if (res) {
      item.Installed = false
      message.info(t('successfulOperation'))
      store.refreshInstalledList()
    } else {
      MessageBox.error(t('failedOperation') + '\n' + t('childAppUninstallErrorTip', [item.DirName]))
    }
  } catch (e) {
    MessageBox.error(getIpcError(e).message, t('errorOccurredDuring', [mt('uninstall', 'ws') + item.Name]))
  }
}

const localInstall = async () => {
  try {
    const extensions = isWindows ? ['zip', '7z'] : ['zip', '7z', 'tar.xz']
    const path = await callStatic('FileDialog', 'showOpenFile', null, [{ name: 'package', extensions }])
    if (!path) return
    const dirName = LocalInstall.getDirName(path)

    if (dirName === 'nginx') {
      MessageBox.warning(mt('Not', 'ws', 'Support', 'ws') + 'nginx')
      return
    }
    const item = childAppList.find((item) => item.DirName === dirName)
    if (!item) {
      MessageBox.error(mt('Not', 'ws', 'Match'))
      return
    }
    if (item.Installed) {
      MessageBox.info(dirName + mt('ws', 'Installed'))
      return
    }
    store.loading = true
    store.loadingTip = t('Installing')
    await LocalInstall.install(path)
    item.Installed = true
    if (proxyObj.selectedType === InstalledType) {
      setShowList(InstalledType)
    }
    store.refreshInstalledList()
  } catch (error) {
    MessageBox.error(error.message ?? error)
  } finally {
    store.loading = false
  }
}

const showPhpExtManager = async (item) => {
  if (isMacOS && !(await SystemExtend.isInstalledBrew())) {
    MessageBox.error(`Homebrew未安装！\n请复制命令到终端执行安装\n/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`)
    return
  }
  phpVersion.value = ChildAppExtend.getPHPVersion(item.DirName)
  phpExtManagerShow.value = true
}

const openUrl = (url) => {
  Opener.openUrl(url)
}
</script>

<style scoped lang="less">
@import '@/renderer/assets/css/var';

.category {
  text-align: center;

  :deep(.ant-radio-button-wrapper) {
    width: 120px;
    text-align: center;
    height: 40px;
    line-height: 40px;
  }
}

.app-list {
  color: @colorText;
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  margin-bottom: 10px;
  overflow: hidden;
  flex: 1;
}

.app-item {
  padding: 12px 0;
  border-bottom: 1px solid @colorBorderSecondary;

  .app-item-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

.app-body {
  flex: 1;
  overflow: auto;

  .app-item-content {
    height: calc(@controlHeight * 1px);
  }

  .app-item {
    &:hover {
      background: @colorBgTextHover;
    }
  }
}

.app-item-avatar {
  margin-left: 16px;
  margin-right: 16px;
  display: flex;

  > span {
    width: 25px;
  }

  > img {
    width: 25px;
    height: 25px;
  }
}

.app-item-title {
  width: 150px;
}

.app-item-desc {
  flex: 2;
}

.app-item-progress {
  color: #666;
  padding: 10px 20px 0 20px;

  .progress-info {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .progress-info-left {
      margin-right: 20px;
    }

    .progress-info-right {
      margin-left: 20px;
    }

    .status-text {
      flex: 1;
      text-align: center;
    }

    .status-text-error {
      flex: 1;
      color: red;
      text-align: center;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}

.app-item-operate {
  flex: 1;
  justify-content: flex-start;
  display: flex;
  align-items: center;
  padding-right: 5px;
}

.local-install {
  display: flex;
  align-items: center;

  > * {
    margin-right: 10px;
  }
}
</style>
