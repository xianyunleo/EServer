<template>
  <div class='content-container'>
    <div class='category'>
      <a-radio-group v-model:value='softwareTypeSelected' button-style='solid' @change='radioGroupChange'>
        <a-radio-button :value='InstalledType'>{{ t('Installed') }}</a-radio-button>
        <a-radio-button :value='enumGetName(EnumSoftwareType, EnumSoftwareType.Server)'>{{ t('Server') }}
        </a-radio-button>
        <a-radio-button :value='enumGetName(EnumSoftwareType, EnumSoftwareType.PHP)'>PHP</a-radio-button>
        <a-radio-button :value='enumGetName(EnumSoftwareType, EnumSoftwareType.Tool)'>{{ t('Tool') }}</a-radio-button>
      </a-radio-group>
    </div>

    <div class='soft-list piece'>
      <div class='soft-head'>
        <div class='soft-item'>
          <div class='soft-item-content'>
            <div class='soft-item-avatar'>
              <span></span>
            </div>
            <div class='soft-item-title'>{{ t('Name') }}</div>
            <div class='soft-item-desc'>{{ t('Desc') }}</div>
            <div class='soft-item-operate'>{{ t('Operation') }}</div>
          </div>
        </div>
      </div>

      <div class='soft-body'>
        <template v-for='item in softwareList' :key='item.Name'>
          <div v-if='item.show' class='soft-item'>
            <div class='soft-item-content'>
              <div class='soft-item-avatar'>
                <img :src='item.Icon' />
              </div>
              <div class='soft-item-title'>{{ item.Name }}</div>
              <div class='soft-item-desc'>{{ item.Desc }}</div>
              <div class='soft-item-operate'>
                <template v-if='item.Installed'>
                  <a-button type='primary' danger style='margin-right: 5px'
                    :disabled='item.CanDelete === false' @click='uninstall(item)'
                  >{{ t('Uninstall') }}</a-button>

                  <a-dropdown :trigger="['click']">
                    <template #overlay>
                      <a-menu>
                        <a-menu-item v-if='item.IsMacApp || item.WinExePath' @click='openApp(item)'>
                          {{ t('Open') }}
                        </a-menu-item>
                        <a-menu-item @click='openInstallPath(item)'>
                          {{ mt('Open', 'ws', 'Directory') }}
                        </a-menu-item>
                        <a-menu-item v-if='item.Type === phpTypeValue' @click='showPhpExtManager(item)'>
                          {{ mt('Install', 'ws', 'Extension') }}
                        </a-menu-item>
                      </a-menu>
                    </template>
                    <a-button>{{ t('Manage') }}<DownOutlined /></a-button>
                  </a-dropdown>
                </template>
                <template v-else>
                  <a-button  v-if='item.installInfo == null || item.showStatusErrorText'
                             type='primary' @click='clickInstall(item)'>{{ t('Install') }}</a-button>

                  <a-button v-else type='primary' @click='clickStop(item)'>{{ t('Stop') }}</a-button>
                </template>
              </div>
            </div>
            <div v-if='item.installInfo' class='soft-item-progress'>
              <a-progress :percent='item.installInfo?.dlInfo?.percent' :show-info='false' status='active' />
              <div class='progress-info'>
                <div class='progress-info-left'>
                  <span v-if='item.installInfo?.status === EnumSoftwareInstallStatus.Downloading'>
                    {{ item.installInfo?.dlInfo?.completedSizeText }}/{{ item.installInfo?.dlInfo?.totalSizeText }}
                  </span>
                </div>
                <div v-if='item.showStatusErrorText' class='status-text-error'>
                  <a-tooltip>
                    <template #title>{{ item.statusErrorText }}</template>
                    {{ item.statusErrorText }}
                  </a-tooltip>
                </div>
                <div class='progress-info-right'>
                  <span v-if='item.installInfo?.status === EnumSoftwareInstallStatus.Downloading'>
                    ↓{{ item.installInfo?.dlInfo?.perSecondText }}/S
                  </span>
                  <span v-else>
                    {{ item.statusText }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <a-card size='small'>
      <div style='display: flex; justify-content: space-between'>
        <a-button type='primary' :icon='h(AppstoreAddOutlined)' @click='localInstall'>
          {{ mt('Local', 'ws', 'Install') }}
        </a-button>
        <div style='display: flex; align-items: center'>
          {{ t('installPackageDownloadUrl') }}:
          <a style='margin: 0 10px' @click="openUrl('http://github.com/xianyunleo/EServerAppStore')">Github</a>
          <a @click="openUrl('https://gitee.com/xianyunleo/EServerAppStore')">Gitee</a>
        </div>
      </div>
    </a-card>
  </div>

  <!--  v-if防止不显示就执行modal里面的代码-->
  <php-ext-manager v-if='phpExtManagerShow' v-model:show='phpExtManagerShow' :phpVersion='phpVersion'>
  </php-ext-manager>

</template>

<script setup>
import { computed, h, ref } from 'vue'
import { useMainStore } from '@/renderer/store'
import { storeToRefs } from 'pinia'
import { message } from 'ant-design-vue'
import { EnumSoftwareInstallStatus, EnumSoftwareType } from '@/shared/utils/enum'
import Installer from '@/main/core/software/Installer'
import { AppstoreAddOutlined, DownOutlined } from '@ant-design/icons-vue'
import Software from '@/main/core/software/Software'
import MessageBox from '@/renderer/utils/MessageBox'
import { enumGetName, getFileSizeText } from '@/shared/utils/utils'
import Native from '@/main/utils/Native'
import PhpExtManager from '@/renderer/components/Software/PhpExtManager.vue'
import SoftwareExtend from '@/main/core/software/SoftwareExtend'
import Path from '@/main/utils/Path'
import { mt, t } from '@/renderer/utils/i18n'
import { isMacOS, isWindows } from '@/main/utils/utils'
import FileDialog from '@/main/utils/FileDialog'
import LocalInstall from '@/main/core/software/LocalInstall'
import { createAsyncComponent } from '@/renderer/utils/utils'
import SystemExtend from '@/main/utils/SystemExtend'

const InstalledType = 'InstalledType'
const AButton = createAsyncComponent(import('ant-design-vue'), 'Button')
const ADropdown = createAsyncComponent(import('ant-design-vue'), 'Dropdown')

const store = useMainStore()
const { softwareList, softwareTypeSelected } = storeToRefs(store)
const phpTypeValue = enumGetName(EnumSoftwareType, EnumSoftwareType.PHP)
const phpExtManagerShow = ref(false)
const phpVersion = ref('')

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

setShowList(softwareTypeSelected.value)

const radioGroupChange = () => {
  setShowList(softwareTypeSelected.value)
}

const clickInstall = async (item) => {
  item.installInfo = { status: '', downloadProgress: {}, dlInfo: {}, dlIntervalId: 0 }
  item.showStatusErrorText = false

  item.statusText = computed(() => {
    if (!item.installInfo) {
      return ''
    }
    switch (item.installInfo.status) {
      case EnumSoftwareInstallStatus.Ready:
        return '正在开始'
      case EnumSoftwareInstallStatus.Downloading:
        return '下载中'
      case EnumSoftwareInstallStatus.Extracting:
        return '解压中'
      case EnumSoftwareInstallStatus.Configuring:
        return '配置中'
      default:
        return ''
    }
  })

  try {
    let installer = new Installer({ ...item }) //将item由Proxy对象转成普通对象
    item.installer = installer

    installer.on('downloadProgress', (progress) => {
      item.installInfo.downloadProgress = progress
    })

    let beforeCompletedSize = 0

    item.installInfo.dlIntervalId = setInterval(() => {
      let progress = item.installInfo.downloadProgress
      setItemDownloadInfo(item, {
        completedSizeText: getFileSizeText(progress.transferred),
        totalSizeText: getFileSizeText(progress.total),
        percent: parseInt(progress.percent * 100),
        perSecondText: getFileSizeText(progress.transferred - beforeCompletedSize)
      })
      beforeCompletedSize = progress.transferred
    }, 1000)

    installer.on('installStatus', (status) => {
      item.installInfo.status = status
      if (status === EnumSoftwareInstallStatus.Downloaded) {
        setItemDownloadInfo(item, { percent: 100 })
        clearInterval(item.installInfo?.dlIntervalId)
      }
      if (status === EnumSoftwareInstallStatus.Finish) {
        item.Installed = true
      }
    })

    await installer.install()
    item.installInfo = null
  } catch (error) {
    //catch 不item.installInfo = null，因为installInfo有信息
    item.statusErrorText = error.message
    item.showStatusErrorText = true
    clearInterval(item.installInfo?.dlIntervalId)
  }
}

const setItemDownloadInfo = (item, dlInfo) => {
  item.installInfo.dlInfo = { ...item.installInfo.dlInfo, ...dlInfo }
}

const clickStop = (item) => {
  item.installer.stopDownload()
  clearInterval(item.installInfo.dlIntervalId)
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

const uninstall = async (item) => {
  try {
    if (await Installer.uninstall(item)) {
      item.installInfo = null
      item.Installed = false
      message.info(t('successfulOperation'))
    } else {
      MessageBox.error(t('failedOperation') + '\n' + t('softwareUninstallErrorTip', [item.DirName]))
    }
  } catch (error) {
    MessageBox.error(error.message ?? error, t('errorOccurredDuring', [mt('uninstall', 'ws') + item.Name]))
  }
}

const localInstall = async () => {
  try {
    const extensions = isWindows ? ['zip', '7z'] : ['zip', '7z', 'tar.xz']
    const path = FileDialog.showOpenFile(null, [{ name: 'package', extensions }])
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
    store.loading = true;
    store.loadingTip = t('Installing')
    await LocalInstall.install(path)
    item.Installed = true
    if (softwareTypeSelected.value === InstalledType) {
      setShowList(InstalledType)
    }
  } catch (error) {
    MessageBox.error(error.message ?? error)
  } finally {
    store.loading = false;
  }
}

const showPhpExtManager = async (item) => {
  if (isMacOS && !await SystemExtend.isInstalledBrew()) {
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

<style scoped lang='less'>
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
