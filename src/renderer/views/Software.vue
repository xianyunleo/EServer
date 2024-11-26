<template>
  <div class="content-container">
    <div class="category">
      <a-radio-group v-model:value="softwareTypeSelected" button-style="solid" @change="radioGroupChange">
        <a-radio-button :value="InstalledType">{{ t('Installed') }}</a-radio-button>
        <a-radio-button :value="enumGetName(EnumSoftwareType, EnumSoftwareType.Server)">{{ t('Server') }}
        </a-radio-button>
        <a-radio-button :value="enumGetName(EnumSoftwareType, EnumSoftwareType.PHP)">PHP</a-radio-button>
        <a-radio-button :value="enumGetName(EnumSoftwareType, EnumSoftwareType.Tool)">{{ t('Tool') }}</a-radio-button>
      </a-radio-group>
    </div>

    <div class="soft-list piece">
      <div class="soft-head">
        <div class="soft-item">
          <div class="soft-item-content">
            <div class="soft-item-avatar">
              <span></span>
            </div>
            <div class="soft-item-title">{{ t('Name') }}</div>
            <div class="soft-item-desc">{{ t('Desc') }}</div>
            <div class="soft-item-operate">{{ t('Operation') }}</div>
          </div>
        </div>
      </div>

      <div class="soft-body">
        <template v-for="item in softwareList" :key="item.Name">
          <div v-if="item.show" class="soft-item">
            <div class="soft-item-content">
              <div class="soft-item-avatar">
                <img :src="item.Icon" />
              </div>
              <div class="soft-item-title">{{ item.Name }}</div>
              <div class="soft-item-desc">{{ t(item.Desc) }}</div>
              <div class="soft-item-operate">
                <template v-if="item.Installed">
                  <a-button type="primary" danger style="margin-right: 5px" :disabled="item.CanDelete === false"
                            @click="uninstall(item.Name)">{{ t('Uninstall') }}
                  </a-button>

                  <a-dropdown :trigger="['click']">
                    <template #overlay>
                      <a-menu>
                        <a-menu-item v-if="item.IsMacApp || item.WinExePath" @click="openApp(item)">
                          {{ t('Open') }}
                        </a-menu-item>
                        <a-menu-item @click="openInstallPath(item)">
                          {{ mt('Open', 'ws', 'Directory') }}
                        </a-menu-item>
                        <a-menu-item v-if="item.ConfPath" @click="openConfFile(item)" key="998">
                          {{ mt('Open', 'ws') }}{{ Path.GetBaseName(item.ConfPath) }}
                        </a-menu-item>
                        <a-menu-item v-if="item.ServerConfPath" @click="openServerConfFile(item)" key="997">
                          {{ mt('Open', 'ws') }}{{ Path.GetBaseName(item.ServerConfPath) }}
                        </a-menu-item>
                        <a-menu-item v-if="item.Type === phpTypeValue" @click="showPhpExtManager(item)">
                          {{ mt('Install', 'ws', 'Extension') }}
                        </a-menu-item>
                      </a-menu>
                    </template>
                    <a-button>{{ t('Manage') }}
                      <DownOutlined />
                    </a-button>
                  </a-dropdown>
                </template>
                <template v-else>
                  <a-button v-if="instMap[item.Name] && !instMap[item.Name].errMsg" type="primary"
                            @click="clickStop(item.Name)">{{ t('Stop') }}
                  </a-button>
                  <a-button v-else type="primary" @click="clickInstall(item.Name)">
                    {{ t('Install') }}
                  </a-button>
                </template>
              </div>
            </div>
            <!-- 安装下载-->
            <div v-if="instMap[item.Name]" class="soft-item-progress">
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
                    <span v-if="instMap[item.Name]?.status === InstStatus.Downloading">
                      {{ instMap[item.Name]?.receivedSizeText }}/{{ instMap[item.Name]?.totalSizeText }}
                    </span>
                  </div>
                  <div class="progress-info-right">
                    <span v-if="instMap[item.Name]?.status === InstStatus.Downloading">
                      ↓ {{ instMap[item.Name]?.perSecondText }}/S
                    </span>
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
      <div style="display: flex; justify-content: space-between">
        <a-button type="primary" :icon="h(AppstoreAddOutlined)" @click="localInstall">
          {{ mt('Local', 'ws', 'Install') }}
        </a-button>
        <div style="display: flex; align-items: center">
          {{ t('installPackageDownloadUrl') }}:
          <a style="margin: 0 10px" @click="openUrl('http://github.com/xianyunleo/EServerAppStore')">Github</a>
          <a @click="openUrl('https://gitee.com/xianyunleo/EServerAppStore')">Gitee</a>
        </div>
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
import { EnumSoftwareInstallStatus, EnumSoftwareType } from '@/shared/utils/enum'
import { AppstoreAddOutlined, DownOutlined } from '@ant-design/icons-vue'
import Software from '@/main/core/software/Software'
import MessageBox from '@/renderer/utils/MessageBox'
import { enumGetName, getFileSizeText, getIpcError } from '@/shared/utils/utils'
import Native from '@/main/utils/Native'
import PhpExtManager from '@/renderer/components/Software/PhpExtManager.vue'
import SoftwareExtend from '@/main/core/software/SoftwareExtend'
import Path from '@/main/utils/Path'
import { mt, t } from '@/renderer/utils/i18n'
import { isMacOS, isWindows } from '@/main/utils/utils'
import LocalInstall from '@/main/core/software/LocalInstall'
import { createAsyncComponent } from '@/renderer/utils/utils'
import SystemExtend from '@/main/utils/SystemExtend'
const callStatic = window.api.callStatic
const InstalledType = 'InstalledType'
const AButton = createAsyncComponent(import('ant-design-vue'), 'Button')
const ADropdown = createAsyncComponent(import('ant-design-vue'), 'Dropdown')

const store = useMainStore()
const { softwareList, softwareTypeSelected } = storeToRefs(store)
const phpTypeValue = enumGetName(EnumSoftwareType, EnumSoftwareType.PHP)
const phpExtManagerShow = ref(false)
const phpVersion = ref('')
const InstStatus = EnumSoftwareInstallStatus

if (!softwareTypeSelected.value) {
  softwareTypeSelected.value = InstalledType
}

const setShowList = (type) => {
  for (const item of softwareList.value) {
    if (type === InstalledType) {
      item.show = item.Installed === true
    } else {
      item.show = type === item.Type
    }
  }
}

const instMap = reactive({})

setShowList(softwareTypeSelected.value)

const radioGroupChange = () => {
  setShowList(softwareTypeSelected.value)
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

const findItem = (name) => softwareList.value.find((item) => item.Name === name)

const clickInstall = async (name) => {
  instMap[name] = {}
  let beforeCompletedSize = 0
  instMap[name].dlIntervalId = setInterval(() => {
    const receivedBytes = instMap[name].receivedBytes
    instMap[name].perSecondText = getFileSizeText(receivedBytes - beforeCompletedSize)
    beforeCompletedSize = receivedBytes
  }, 1000)

  try {
    await window.api.call('softwareInstall', name)
  } catch (e) {
    clearInterval(instMap[name].dlIntervalId)
    instMap[name].errMsg = getIpcError(e).message
  }
}

window.api.onSoftDlProgress((name, progress) => {
  instMap[name] = {
    ...instMap[name],
    receivedBytes: progress.receivedBytes,
    receivedSizeText: getFileSizeText(progress.receivedBytes),
    totalSizeText: getFileSizeText(progress.totalBytes),
    percent: parseInt(progress.receivedBytes / progress.totalBytes * 100)
  }
})

window.api.onSoftInstStatus((name, status) => {
  if (status === InstStatus.Downloaded) {
    clearInterval(instMap[name].dlIntervalId)
  }
  const statusText = getStatusText(status)
  instMap[name] = { ...instMap[name], status, statusText }

  if (status === InstStatus.Finish) {
    instMap[name] = null
    findItem(name).Installed = true
    store.refreshInstalledList()
  }
})

window.api.onSoftDlCancelled((name) => {
  //如果不是点击clickStop的取消
  if (instMap[name]) {
    clearInterval(instMap[name].dlIntervalId)
    instMap[name].errMsg = `${t('errorOccurredDuring', [t('download')])}，${mt('Network', 'ws', 'Error')}`
  }
})

const clickStop = (name) => {
  clearInterval(instMap[name].dlIntervalId)
  instMap[name] = null
  window.api.call('softwareStopInstall', name)
}

const openApp = (item) => {
  let appPath = ''
  if (isWindows) {
    appPath = Path.Join(Software.getPath(item), item.WinExePath)
  } else if (isMacOS) {
    appPath = Software.getPath(item)
  }
  Native.openApp(appPath)
}

const openInstallPath = async (item) => {
  let path = item.IsMacApp ? Software.getTypePath(item.Type) : Software.getPath(item)
  Native.openDirectory(path)
}

const openConfFile = (item) => Native.openTextFile(Software.getConfPath(item))
const openServerConfFile = (item) => Native.openTextFile(Software.getServerConfPath(item))

const uninstall = async (name) => {
  const item = findItem(name)
  try {
    const res = await window.api.call('softwareUninstall', name)
    if (res) {
      item.Installed = false
      message.info(t('successfulOperation'))
      store.refreshInstalledList()
    } else {
      MessageBox.error(t('failedOperation') + '\n' + t('softwareUninstallErrorTip', [item.DirName]))
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
    const item = softwareList.value.find((item) => item.DirName === dirName)
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
    if (softwareTypeSelected.value === InstalledType) {
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
  phpVersion.value = SoftwareExtend.getPHPVersion(item.DirName)
  phpExtManagerShow.value = true
}

const openUrl = (url) => {
  Native.openUrl(url)
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

.soft-list {
  color: @colorText;
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  margin-bottom: 10px;
  overflow: hidden;
  flex: 1;
}

.soft-item {
  padding: 12px 0;
  border-bottom: 1px solid @colorBorderSecondary;

  .soft-item-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

.soft-body {
  flex: 1;
  overflow: auto;

  .soft-item-content {
    height: calc(@controlHeight * 1px);
  }

  .soft-item {
    &:hover {
      background: @colorBgTextHover;
    }
  }
}

.soft-item-avatar {
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

.soft-item-title {
  width: 150px;
}

.soft-item-desc {
  flex: 2;
}

.soft-item-progress {
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

.soft-item-operate {
  flex: 1;
  justify-content: flex-start;
  display: flex;
  align-items: center;
  padding-right: 5px;
}
</style>
