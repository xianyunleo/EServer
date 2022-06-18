<template>
  <div class="content-container">
    <a-card title="快捷操作" class="quick-card">
      <div class="quick-card-content">
        <a-button type="primary">一键启动</a-button>
        <a-button type="primary">命令行终端</a-button>
        <a-button type="primary">数据库管理</a-button>
        <a-button type="primary">网站目录</a-button>
      </div>
    </a-card>

    <a-table :columns="columns" :data-source="data" class="content-table" :pagination="false" size="middle" >
      <template #bodyCell="{ column }">
        <template v-if="column.dataIndex === 'status'">
          <div style="font-size: 20px;">
<!--            <caret-right-outlined style="color: #20a53a;" />-->
            <right-square-filled style="color: #20a53a;" />
          </div>
        </template>
        <template v-if="column.dataIndex === 'service'">
          <div>
            <a-switch/>
          </div>
        </template>
        <template v-if="column.dataIndex === 'env'">
          <div>
            <a-switch/>
          </div>
        </template>
        <template v-if="column.dataIndex === 'operate'">
          <div class="operate-td">
            <a-button type="primary">启动</a-button>
            <a-button type="primary">重启</a-button>
            <a-dropdown :trigger="['click']">
              <template #overlay>
                <a-menu @click="handleMenuClick">
                  <a-menu-item key="1">
                    修改
                  </a-menu-item>
                  <a-menu-item key="2">
                    删除
                  </a-menu-item>
                  <a-menu-item key="3">
                    打开根目录
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
      <div>
        2022-06-04 15:39:57 [Nginx] 启动成功<br>
        2022-06-04 19:39:57 [Nginx] 关闭成功
      </div>
    </a-card>
  </div>
</template>

<script>
import {ref,defineComponent} from "vue";
import {DownOutlined,RightSquareFilled} from '@ant-design/icons-vue';
const columns = [
  {
    title: '服务名',
    width: 100,
    dataIndex: 'name',
  }, {
    title: '状态',
    dataIndex: 'status',
    width: 80,
    align: 'center',
  },  {
    title: '自启服务',
    dataIndex: 'service',
    width: 100,
    align: 'center',
  }, {
    title: '环境变量',
    dataIndex: 'env',
    width: 100,
    align: 'center',
  }, {
    title: '操作',
    dataIndex: 'operate',
    width: 250,
    align: 'center',
  }
];
export default defineComponent({
  name: "HomePage",
  components: {
    DownOutlined,RightSquareFilled
  },
  setup() {
    let addWebModelVisible = ref('addWebModelVisible')
    const data = [
      {
        name: 'Nginx',
        port: '80,443',
        pid: '180,1443',
      },
      {
        name: 'PHP-FPM',
      },
      {
        name: 'Redis',
      },
    ];

    let addWeb = ()=>{
      addWebModelVisible= false
    }

    return {
      data,
      columns,
      addWeb,
      addWebModelVisible
    };
  }
})
</script>

<style scoped>
.quick-card {
  margin-top: 10px;
}

.quick-card-content {
  display: flex;
  justify-content: space-around
}

.log-card {
  margin-bottom: 10px;
}
.operate-td{
  display: flex;
  justify-content: space-evenly;
}

.log-card >>> .ant-card-body {
  height: 150px;
  padding: 12px 24px;
}

</style>