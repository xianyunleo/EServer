<template>
  <div class="content-container">
    <a-card title="快捷操作" class="quick-card">
      <div class="quick-card-content">
<!--        <a-button type="primary">一键启动</a-button>-->
<!--        <a-button type="primary">命令行终端</a-button>-->
        <a-button type="primary" @click="corePathClick">{{APP_NAME}}目录</a-button>
        <a-button type="primary" @click="wwwPathClick">网站目录</a-button>
      </div>
    </a-card>

    <a-table :columns="columns" :data-source="serverList" class="content-table" :pagination="false" size="middle">
      <template #bodyCell="{ column, record}">
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
            <a-button type="primary" @click="startServerClick(record)" v-show="!record.isRunning">启动</a-button>
            <a-button type="primary" @click="stopServerClick(record)" v-show="record.isRunning">停止</a-button>
            <a-button type="primary" @click="restartServerClick(record)">重启</a-button>
            <a-dropdown :trigger="['click']">
              <template #overlay>
                <a-menu >
                  <a-menu-item @click="openInstallPath(record)">打开所在目录</a-menu-item>
                  <a-menu-item v-if="record.ServerConfPath" @click="openConfPath(record)">打开配置文件</a-menu-item>
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

    <a-card title="服务运行日志" class="log-card">
      下个版本开放！！！
<!--      <div>-->
<!--        2022-06-04 15:39:57 [Nginx] 启动成功<br>-->
<!--        2022-06-04 19:39:57 [Nginx] 关闭成功-->
<!--      </div>-->
    </a-card>
  </div>
</template>

<script setup>
// eslint-disable-next-line no-unused-vars
import {watch} from 'vue';
import {useMainStore} from '@/renderer/store'
import {DownOutlined, RightSquareFilled} from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';

import App from "@/main/App";
import GetPath from "@/shared/utils/GetPath";
import Software from "@/main/core/software/Software";
import ServerControl from "@/main/core/ServerControl";
import MessageBox from "@/renderer/utils/MessageBox";
import {storeToRefs} from "pinia/dist/pinia";
import {APP_NAME} from "@/shared/constant";
import Native from "@/renderer/utils/Native";
import {sleep} from "@/shared/utils/utils";
//import {sleep} from "@/main/utils";

const columns = [
  {
    title: '服务名',
    width: 180,
    dataIndex: 'Name',
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

//todo 检查所有服务状态，不加await，配合自启服务显示，放到运行日志里
let serverList = serverSoftwareList.value.filter(item => Software.IsInStalled(item));

const serviceChange = ()=>{
  message.info('下个版本开放！！！');
}

const corePathClick = ()=>{
  Native.openPath(App.getUserCorePath());
}
const wwwPathClick = ()=>{
  Native.openPath(GetPath.getWWWPath());
}

const openInstallPath = (item) => {
  Native.openPath(Software.getPath(item));
}

const openConfPath = (item) => {
  Native.openTextFile(Software.getServerConfPath(item));
}

const startServerClick = async (item) => {
  try {
    //todo 开始前loading，开始后sleep 1-3s
    await ServerControl.start(item);
    const unwatch = watch(() => item.errMsg, (errMsg) => {
      if (errMsg) {
        unwatch();
        MessageBox.error(errMsg, '启动服务出错！');
      }
    });
    await sleep(500);
  } catch (error) {
    MessageBox.error(error.message ?? error, '启动服务出错！');
  }
}

const restartServerClick = async (item) => {
  try {
    //todo 开始前loading，开始后sleep 1-3s
    await ServerControl.stop(item);
    await sleep(300);
    if (item.isRunning) {
      MessageBox.error('停止服务出错！', '重启服务出错！');
      return;
    }
    await ServerControl.start(item);
    const unwatch = watch(() => item.errMsg, (errMsg) => {
      if (errMsg) {
        unwatch();
        MessageBox.error(errMsg, '重启服务出错！');
      }
    });
    await sleep(500);
  } catch (error) {
    MessageBox.error(error.message ?? error, '重启服务出错！');
  }
}

const stopServerClick = async (item) => {
  try {
    await ServerControl.stop(item);
  } catch (error) {
    MessageBox.error(error.message ?? error, '启动服务出错！');
  }
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
