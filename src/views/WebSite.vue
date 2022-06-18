<template>
  <div class="content-container">
    <div class="web-header piece">
      <a-button type="primary" @click="showModal">添加网站</a-button>
      <input-with-search placeholder="请输入域名" style="width: 200px" @search="searchWeb"
      />
    </div>

    <a-table :scroll="{y: true}" :columns="columns" :data-source="data" class="content-table web-table" :pagination="false" size="middle">
      <template #bodyCell="{ column }">
        <template v-if="column.dataIndex === 'operate'">
          <div class="operate">
            <a-dropdown :trigger="['click']">
              <template #overlay>
                <a-menu @click="handleMenuClick">
                  <a-menu-item key="1" @click="editWeb">修改</a-menu-item>
                  <a-menu-item key="2">删除</a-menu-item>
                  <a-menu-item key="3">打开根目录</a-menu-item>
                </a-menu>
              </template>
              <a-button>管理
                <DownOutlined/>
              </a-button>
            </a-dropdown>
          </div>
        </template>
      </template>
    </a-table>
  </div>
  <add-web-site-modal v-model:visible="addWebModalVisible"/>
</template>

<script>
import {ref, defineComponent} from "vue";
import {DownOutlined} from '@ant-design/icons-vue';
import InputWithSearch from "@/components/InputWithSearch";
import AddWebSiteModal from "@/components/WebSite/AddWebSiteModal";

const columns = [
  {
    title: '网站域名',
    width: 100,
    dataIndex: 'serverName',
  }, {
    title: '根目录',
    dataIndex: 'path',
    width: 120,
  }, {
    title: 'PHP版本',
    dataIndex: 'phpVersion',
    width: 50,
    align: 'center',
  }, {
    title: '操作',
    dataIndex: 'operate',
    width: 100,
    align: 'center',
  }
];
export default defineComponent({
  name: "WebSite",
  components: {AddWebSiteModal, InputWithSearch, DownOutlined},
  setup() {
    let addWebModalVisible = ref(false)
    let editWebModalVisible = ref(false)
    let showModal = () => {
      addWebModalVisible.value = true;
    };
    // eslint-disable-next-line no-unused-vars
    let editWeb = () => {
      editWebModalVisible.value = true;
    }
    let searchWeb = (val) => {
      console.log(val)
    }
    let addWeb = () => {
      console.log(45465)
    }
    const data = [
      {
        serverName: 'www.a.com',
      },
      {
        serverName: 'www.b.com',
      },
      {
        serverName: 'www.c.com',
      }, {
        serverName: 'www.a.com',
      },
      {
        serverName: 'www.b.com',
      },
      {
        serverName: 'www.c.com',
      }, {
        serverName: 'www.a.com',
      },
      {
        serverName: 'www.b.com',
      },
      {
        serverName: 'www.c.com',
      }, {
        serverName: 'www.a.com',
      },
      {
        serverName: 'www.b.com',
      },
      {
        serverName: 'www.c.com',
      }, {
        serverName: 'www.a.com',
      },
      {
        serverName: 'www.b.com',
      },
      {
        serverName: 'www.c.com',
      }, {
        serverName: 'www.a.com',
      },
      {
        serverName: 'www.b.com',
      },
      {
        serverName: 'www.c.com',
      },
    ];

    return {data, columns, searchWeb, showModal, addWebModalVisible, addWeb};
  }
})
</script>

<style scoped>
.web-header {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  padding: 15px 15px;
}

.web-table {
  display: flex;
  height: 0;
}

.web-table >>> .ant-spin-nested-loading {
  display: flex;
}

.web-table >>> .ant-spin-container {
  display: flex;
}

.web-table >>> .ant-table {
  display: flex;
}

.web-table >>> .ant-table-container {
  display: flex;
  flex-direction: column;
}

.web-table >>> .ant-table-header {
  overflow: visible !important;
}
</style>