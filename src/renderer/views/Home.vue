<template>
  <div class="content-container">
    <a-card title="快捷操作" class="quick-card">
      <div class="quick-card-content">
<!--        <a-button type="primary">一键启动</a-button>-->
<!--        <a-button type="primary">命令行终端</a-button>-->
        <a-tooltip>
          <template #title>在设置中选择服务列表</template>
          <a-button type="primary" @click="oneClickStart" :disabled="serverTableLoading">一键启动</a-button>
        </a-tooltip>

        <a-tooltip>
          <template #title>在设置中选择服务列表</template>
          <a-button type="primary" @click="oneClickStop" :disabled="serverTableLoading">一键停止</a-button>
        </a-tooltip>



        <a-button type="primary" @click="corePathClick">{{APP_NAME}}目录</a-button>
        <a-button type="primary" @click="wwwPathClick">网站目录</a-button>
      </div>
    </a-card>

    <a-table :columns="columns" :data-source="serverList" class="content-table" :pagination="false" size="middle"
    :loading="serverTableLoading" :scroll="{y: 'calc(100vh - 240px)'}">
      <template #bodyCell="{ column, record}">
        <template v-if="column.dataIndex === 'name'">
          <div>
            {{ record.ServerName ? record.ServerName : record.Name }}
          </div>
        </template>
        <template v-if="column.dataIndex === 'status'">
          <div style="font-size: 20px;">
            <right-square-filled style="color: red;" v-show="!record.isRunning"/>
            <right-square-filled style="color: #20a53a;" v-show="record.isRunning"/>
          </div>
        </template>
        <template v-if="column.dataIndex === 'service'">
          <div>
            <a-switch @click="serviceChange" />
          </div>
        </template>
        <template v-if="column.dataIndex === 'operate'">
          <div class="operate-td">
            <a-button type="primary" @click="startServerClick(record)" v-show="!record.isRunning"
                      :loading="record.btnLoading">
              <template #icon>
                <PoweroffOutlined/>
              </template>
              启动
            </a-button>
            <a-button type="primary" @click="stopServerClick(record)" v-show="record.isRunning"
                      :loading="record.btnLoading">
              <template #icon><PoweroffOutlined/></template>
              停止
            </a-button>
            <a-button  type="primary" @click="restartServerClick(record)"
                       :loading="record.btnLoading" :disabled="!record.isRunning">
              <template #icon><ReloadOutlined /></template>
              重启
            </a-button>
            <a-dropdown :trigger="['click']">
              <template #overlay>
                <a-menu >
                  <a-menu-item @click="openInstallDir(record)">打开所在目录</a-menu-item>
                  <a-menu-item v-if="record.ConfPath" @click="openConfFile(record)">
                    打开{{ Path.GetBaseName(record.ConfPath) }}
                  </a-menu-item>
                  <a-menu-item v-if="record.ServerConfPath" @click="openServerConfFile(record)">
                    打开{{ Path.GetBaseName(record.ServerConfPath) }}
                  </a-menu-item>
                  <a-menu-item v-for="(item,i) in record.ExtraFiles" :key="i" @click="openExtraFile(record,item)">
                    打开{{item.Name}}
                  </a-menu-item>
                </a-menu>
              </template>
              <a-button>
                管理
                <DownOutlined/>
              </a-button>
            </a-dropdown>
          </div>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup>
// eslint-disable-next-line no-unused-vars
import {computed, inject, ref, watch} from 'vue';
import {useMainStore} from '@/renderer/store'
import {DownOutlined, RightSquareFilled,PoweroffOutlined,ReloadOutlined} from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import App from "@/main/App";
import GetPath from "@/shared/utils/GetPath";
import Software from "@/main/core/software/Software";
import ServerControl from "@/main/core/ServerControl";
import MessageBox from "@/renderer/utils/MessageBox";
import {storeToRefs} from "pinia/dist/pinia";
import {APP_NAME} from "@/shared/constant";
import Native from "@/renderer/utils/Native";
//import {sleep} from "@/shared/utils/utils";
import Path from "@/main/utils/Path";
import ProcessExtend from "@/main/core/ProcessExtend";
import Settings from "@/main/Settings";
import SoftwareExtend from "@/main/core/software/SoftwareExtend";
import {sleep} from "@/shared/utils/utils";


const serverTableLoading = ref(false);
const globalSpinning = inject('globalSpinning')

const columns = [
  {
    title: '服务名',
    width: 180,
    dataIndex: 'name',
  }, {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    align: 'center',
  },{
    title: '操作',
    dataIndex: 'operate',
    align: 'center',
  }
];

const mainStore = useMainStore();
const {serverSoftwareList} = storeToRefs(mainStore);

const serverList = computed(() => serverSoftwareList.value.filter(item => Software.IsInstalled(item)));


const refreshServerStatus = async () => {
  let processList = await ProcessExtend.getList({directory: GetPath.getSoftwarePath()});
  let pathList = processList.map(item => item.path);
  for (const item of serverList.value) {
    let serverProcessPath = Software.getServerProcessPath(item);
    item.isRunning = pathList.includes(serverProcessPath);
  }
};

(async () => {
  if (!globalSpinning.value) {
    serverTableLoading.value = true;
    await refreshServerStatus();
    serverTableLoading.value = false;
  }
})()

const serviceChange = ()=>{
  message.info('下个版本开放！！！');
}

const corePathClick = ()=>{
  Native.openPath(App.getUserCorePath());
}
const wwwPathClick = ()=>{
  Native.openPath(GetPath.getWebsitePath());
}

const openInstallDir = (item) => {
  Native.openPath(Software.getPath(item));
}

const openConfFile = (item) => {
  Native.openTextFile(Software.getConfPath(item));
}

const openServerConfFile = (item) => {
  Native.openTextFile(Software.getServerConfPath(item));
}

const openExtraFile = (item, extraFile) => {
  Native.openTextFile(Path.Join(Software.getPath(item), extraFile.Path));
}

const getNginxRequirePhpList = async () => {
  const list = await SoftwareExtend.getNginxRequirePhpList();
  return list.map(item => `PHP-${item}`);
}

const oneClickStart = async () => {
  serverTableLoading.value = true;
  const oneClickServerList = ref(Settings.get('OneClickServerList'));
  //oneClickServerIncludePhpFpm 基本上默认为true
  const oneClickServerIncludePhpFpm = oneClickServerList.value.includes('PHP-FPM');
  const requirePhpList = await getNginxRequirePhpList();
  serverList.value.forEach(async (item) => {
    if (oneClickServerList.value.includes(item.Name)) {
      startServerClick(item);
    } else if (item.Name.match(/^PHP-[.\d]+$/) && requirePhpList.includes(item.Name) && oneClickServerIncludePhpFpm) {
      startServerClick(item);
    }
  })
  serverTableLoading.value = false;
}

const oneClickStop = async () => {
  serverTableLoading.value = true;
  const oneClickServerList = ref(Settings.get('OneClickServerList'));
  //oneClickServerIncludePhpFpm 基本上默认为true
  const oneClickServerIncludePhpFpm = oneClickServerList.value.includes('PHP-FPM');
  const requirePhpList = await getNginxRequirePhpList();

  const promiseStopServer = async (item)=>{
    if (oneClickServerList.value.includes(item.Name)) {
      stopServerClick(item,false);
    } else if (item.Name.match(/^PHP-[.\d]+$/) && requirePhpList.includes(item.Name) && oneClickServerIncludePhpFpm) {
      stopServerClick(item,false);
    }
  }

  const promiseArray = serverList.value.map(item => promiseStopServer(item));
  await Promise.all(promiseArray);
  for (let i = 0; i < 10; i++) {
    await sleep(1000);
    let filterArr = serverList.value.filter(item => item.isRunning === false);
    if (filterArr.length === serverList.value.length) {
      break;
    }
  }
  await refreshServerStatus();
  serverTableLoading.value = false;
}

const startServerClick = async (item) => {
  if (item.isRunning) {
    return;
  }
  item.btnLoading = true;
  try {
    if (item.Name === 'Nginx') {
      await ServerControl.killWebServer();
    }

    await ServerControl.start(item);
    if (!item.unwatch) {
      item.unwatch = watch(() => item.errMsg, (errMsg) => {
        if (errMsg) {
          MessageBox.error(errMsg, '启动服务出错！');
        }
      });
    }
  } catch (error) {
    MessageBox.error(error.message ?? error, '启动服务出错！');
  }
  item.btnLoading = false;
}

const restartServerClick = async (item) => {
  item.btnLoading = true;
  try {
    await ServerControl.stop(item);
    if (item.isRunning) {
      throw new Error('服务没有成功停止！');
    }
    await ServerControl.start(item);
  } catch (error) {
    MessageBox.error(error.message ?? error, '重启服务出错！');
  }
  item.btnLoading = false;
}

const stopServerClick = async (item, autoRefreshServerStatus = true) => {
  if (!item.isRunning) {
    return;
  }
  item.btnLoading = true;
  try {
    await ServerControl.stop(item);
    if (item.isRunning && autoRefreshServerStatus) {
      await refreshServerStatus();
    }
  } catch (error) {
    MessageBox.error(error.message ?? error, '停止服务出错！');
  }
  item.btnLoading = false;
}

</script>

<style scoped lang="scss">
.quick-card {
  margin-top: 10px;
}

.quick-card-content {
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
