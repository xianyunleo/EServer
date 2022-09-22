<template>
  <div class="content-container">
    <div class="category">
      <a-radio-group v-model:value="softwareTypeSelected" button-style="solid" @change="radioGroupChange">
        <a-radio-button value="Installed">已安装</a-radio-button>
        <a-radio-button :value="enumGetName(EnumSoftwareType,EnumSoftwareType.Server)">服务</a-radio-button>
        <a-radio-button :value="enumGetName(EnumSoftwareType,EnumSoftwareType.PHP)">PHP</a-radio-button>
        <a-radio-button :value="enumGetName(EnumSoftwareType,EnumSoftwareType.Tool)">工具</a-radio-button>
      </a-radio-group>
    </div>

    <div class="soft-list piece">
      <div class="soft-head">
        <div class="soft-item">
          <div class="soft-item-content">
            <div class="soft-item-avatar">
              <span></span>
            </div>
            <div class="soft-item-title">软件名称</div>
            <div class="soft-item-desc">说明</div>
            <div class="soft-item-operate">操作</div>
          </div>
        </div>
      </div>

      <div class="soft-body">
        <div class="soft-item" v-for="item in softwareList" :key="item.key" v-show="item.show">

          <div class="soft-item-content">
            <div class="soft-item-avatar">
              <img :src="item.Icon">
            </div>
            <div class="soft-item-title">{{ item.Name }}</div>
            <div class="soft-item-desc">{{ item.Desc }}</div>
            <div class="soft-item-operate">
              <template v-if="item.Installed">
                <a-dropdown :trigger="['click']">
                  <template #overlay>
                    <a-menu>
                      <a-menu-item @click="openInstallPath(item)">打开所在目录</a-menu-item>
                    </a-menu>
                  </template>
                  <a-button>管理
                    <DownOutlined/>
                  </a-button>
                </a-dropdown>
                <a-button :disabled="item.CanDelete===false" type="primary" @click="uninstall(item)">卸载</a-button>
              </template>
              <template v-else>
                <a-button v-if="item.installInfo == null || item.showStatusErrorText"
                          type="primary" @click="clickInstall(item)">安装
                </a-button>

                <a-button v-else type="primary" @click="clickStop(item)">停止</a-button>
              </template>
            </div>
          </div>
          <div class="soft-item-progress" v-show="item.installInfo">
            <a-progress :percent="item.installInfo?.dlInfo?.percent" :show-info="false" status="active"/>
            <div class="progress-info">
              <div class="progress-info-left">
                <span v-show="item.installInfo?.status === EnumSoftwareInstallStatus.Downloading">
                  {{ item.installInfo?.dlInfo?.completedSize }}/{{ item.installInfo?.dlInfo?.totalSize }}
                </span>
              </div>
              <div class="status-text-error" v-show="item.showStatusErrorText">
                <a-tooltip>
                  <template #title>{{ item.statusErrorText }}</template>
                  {{ item.statusErrorText }}
                </a-tooltip>
              </div>
              <div class="progress-info-right">
                <span v-if="item.installInfo?.status === EnumSoftwareInstallStatus.Downloading">
                  ↓{{ item.installInfo?.dlInfo?.perSecond }}/S
                </span>
                <span v-else>
                  {{ item.statusText }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup>
import {computed} from 'vue';
import {useMainStore} from '@/renderer/store';
import {storeToRefs} from 'pinia';
import {message} from "ant-design-vue";
import {EnumSoftwareInstallStatus, EnumSoftwareType} from "@/shared/enum";
import Installer from "@/main/core/software/Installer";
import {DownOutlined} from '@ant-design/icons-vue';
import Software from "@/main/core/software/Software";
import MessageBox from "@/renderer/utils/MessageBox";
import {enumGetName} from "@/shared/utils/utils";
import Native from "@/renderer/utils/Native";
//import path from "path";

const mainStore = useMainStore();
const {softwareList,  softwareTypeSelected} = storeToRefs(mainStore);
softwareTypeSelected.value = 'Installed';

for (const item of softwareList.value) {
  item.Installed = Software.IsInStalled(item);
}

const setShowList = (type) => {
  for (const item of softwareList.value) {
    if (type === 'Installed') {
      item.show = item.Installed === true;
    } else {
      item.show = type === item.Type;
    }
  }
}

setShowList(softwareTypeSelected.value);

const radioGroupChange = () => {
  setShowList(softwareTypeSelected.value);
}

const clickInstall = async (item) => {
  //判断是否已经有安装信息，并且没有错误
  if (item.installInfo != null && !item.showStatusErrorText) {
    return;
  }
  item.installInfo = {};
  item.downloadAbortController = new AbortController();
  item.showStatusErrorText = false;
  item.statusText = computed(() => {
    if (!item.installInfo) {
      return '';
    }
    switch (item.installInfo.status) {
      case EnumSoftwareInstallStatus.Ready:
        return '正在开始';
      case EnumSoftwareInstallStatus.Downloading:
        return '下载中';
      case EnumSoftwareInstallStatus.Extracting:
        return '解压中';
      default:
        return '';
    }
  });
  try {
    let installer = new Installer(item);
    await installer.install();
    if (item.installInfo.status === EnumSoftwareInstallStatus.Finish) {
      item.Installed = true;
    }
    item.installInfo = null;
  } catch (error) {
    //catch 不item.installInfo = null，因为installInfo有信息要显示
    item.statusErrorText = error.message;
    item.showStatusErrorText = true;
  }
}
const clickStop = (item) => {
  item.downloadAbortController.abort();
}

const openInstallPath = async (item) => {
  Native.openPath(Software.getPath(item));
}

const uninstall = async (item) => {
  try {
    Installer.uninstall(item)
    item.installInfo = null;
    item.Installed = false;
    message.info('卸载完成');
  } catch (error) {
    MessageBox.error(error.message ?? error, '卸载出错！');
  }
}

</script>

<style scoped lang="scss">
.category {
  margin-top: 10px;
  text-align: center;

  :deep(.ant-radio-button-wrapper) {
    width: 120px;
    text-align: center;
    height: 40px;
    line-height: 40px;
  }
}

.soft-list {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  margin-bottom: 10px;
  overflow: hidden;
  flex: 1;

  :deep(.ant-btn) {
    height: 32px;
  }
}

.soft-item {
  padding: 12px 0;
  color: #000000d9;
  border-bottom: 1px solid #f0f0f0;

  .soft-item-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

.soft-head {
  .soft-item {
    background: #fafafa;
  }
}

.soft-body {
  flex: 1;
  overflow: auto;

  .soft-item {
    &:hover {
      background: #fafafa;
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
  flex: 1;
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
  width: 200px;
  display: flex;
  align-items: center;
  justify-content:space-around;
}
</style>
