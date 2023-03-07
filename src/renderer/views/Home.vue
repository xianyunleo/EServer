<template>
  <div class="content-container">
    <a-card title="快捷操作" class="quick-card">
      <div class="quick-card-content">
        <a-button type="primary" @click="oneClickStart" :disabled="serverTableLoading">一键启动</a-button>
        <a-button type="primary" @click="oneClickStop" :disabled="serverTableLoading">一键停止</a-button>
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
import {DownOutlined, PoweroffOutlined, ReloadOutlined, RightSquareFilled} from '@ant-design/icons-vue';
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


const getProcessList = async () => {
  let list = await ProcessExtend.getList({directory: GetPath.getSoftwarePath()});
  //过滤掉子进程，剔除子进程
  let newList = [];
  for (const item of list) {
    if (!list.find(item2 => item2.pid === item.ppid)) {
      newList.push([item.path, item.pid])
    }
  }
  return newList;
}

const initServerListStatus = async () => {
  const processList = await getProcessList();
  const processMap = new Map(processList);

  const initServerStatus = async (item) => {
    const itemProcessPath = Software.getServerProcessPath(item);
    const pid = processMap.get(itemProcessPath);
    if (pid) {
      item.isRunning = true;
      item.pid = pid;
    } else {
      item.isRunning = false;
      item.pid = null;
    }
  }

  const promiseArray = serverList.value.map(item => initServerStatus(item));
  await Promise.all(promiseArray);
};

(async () => {
  if (!globalSpinning.value) {
    serverTableLoading.value = true;
    await initServerListStatus();
    serverTableLoading.value = false;
  }
})()


const corePathClick = ()=>{
  Native.openDirectory(App.getUserCorePath());
}
const wwwPathClick = ()=>{
  Native.openDirectory(GetPath.getWebsitePath());
}

const openInstallDir = (item) => {
  Native.openDirectory(Software.getPath(item));
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
}

const oneClickStop = async () => {
  const oneClickServerList = ref(Settings.get('OneClickServerList'));
  //oneClickServerIncludePhpFpm 基本上默认为true
  const oneClickServerIncludePhpFpm = oneClickServerList.value.includes('PHP-FPM');
  const requirePhpList = await getNginxRequirePhpList();

  serverList.value.forEach(async (item) => {
    if (oneClickServerList.value.includes(item.Name)) {
      stopServerClick(item);
    } else if (item.Name.match(/^PHP-[.\d]+$/) && requirePhpList.includes(item.Name) && oneClickServerIncludePhpFpm) {
      stopServerClick(item);
    }
  })
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

    for (let i = 0; i < 10; i++) {
      if (item.isRunning === false) {
        break;
      }
      await sleep(500);
      item.isRunning = ProcessExtend.pidIsRunning(item.pid);
    }

    if (item.isRunning) {
      throw new Error('服务没有成功停止！');
    }

    await ServerControl.start(item);
  } catch (error) {
    MessageBox.error(error.message ?? error, '重启服务出错！');
  }
  item.btnLoading = false;
}

const stopServerClick = async (item) => {
  if (!item.isRunning) {
    return;
  }
  item.btnLoading = true;
  try {
    await ServerControl.stop(item);

    for (let i = 0; i < 10; i++) {
      if (item.isRunning === false) {
        break;
      }
      await sleep(500);
      item.isRunning = ProcessExtend.pidIsRunning(item.pid);
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
