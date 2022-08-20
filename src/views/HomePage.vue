<template>
  <div class="content-container">
    <a-card title="快捷操作" class="quick-card">
      <div class="quick-card-content">
<!--        <a-button type="primary">一键启动</a-button>-->
<!--        <a-button type="primary">命令行终端</a-button>-->
        <a-button type="primary" @click="corePathClick">核心目录</a-button>
        <a-button type="primary" @click="wwwPathClick">网站目录</a-button>
      </div>
    </a-card>

    <a-table :columns="columns" :data-source="data" class="content-table" :pagination="false" size="middle">
      <template #bodyCell="{ column, record}">
        <template v-if="column.dataIndex === 'status'">
          <div style="font-size: 20px;">
            <!--            <caret-right-outlined style="color: #20a53a;" />-->
            <right-square-filled style="color: #20a53a;"/>
          </div>
        </template>
        <template v-if="column.dataIndex === 'service'">
          <div>
            <a-switch @click="serviceChange" />
          </div>
        </template>
        <template v-if="column.dataIndex === 'operate'">
          <div class="operate-td">
            <a-button type="primary" @click="startClick(record)">启动</a-button>
            <a-button type="primary">重启</a-button>
            <a-dropdown :trigger="['click']">
              <template #overlay>
                <a-menu >
                  <a-menu-item key="1">
                    打开所在目录
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

    <a-card title="运行日志" class="log-card">
      下个版本开放！！！
<!--      <div>-->
<!--        2022-06-04 15:39:57 [Nginx] 启动成功<br>-->
<!--        2022-06-04 19:39:57 [Nginx] 关闭成功-->
<!--      </div>-->
    </a-card>
  </div>
</template>

<script setup>

import {DownOutlined, RightSquareFilled} from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import Tool from '@/main/Tool'
import App from "@/main/App";
import GetPath from "@/main/GetPath";
import Software from "@/main/software/Software";
import ServerControl from "@/main/ServerControl";
import MessageBox from "@/main/MessageBox";
const columns = [
  {
    title: '服务名',
    width: 100,
    dataIndex: 'Name',
  }, {
    title: '状态',
    dataIndex: 'status',
    width: 80,
    align: 'center',
  }, {
    title: '自启服务',
    dataIndex: 'service',
    width: 100,
    align: 'center',
  },{
    title: '操作',
    dataIndex: 'operate',
    width: 250,
    align: 'center',
  }
];

let data = [];
const list = Software.getList('Server');
data = list.filter((item)=>item.Installed);
const serviceChange = ()=>{
  message.info('下个版本开放！！！');
}

const corePathClick = ()=>{
  Tool.openPath(App.getUserCorePath());
}
const wwwPathClick = ()=>{
  Tool.openPath(GetPath.getWWWPath());
}

const startClick = async (item) => {
  try {
    await ServerControl.start(item);
  } catch (error) {
    MessageBox.error(error.message ? error.message : error, '启动服务出错！');
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
