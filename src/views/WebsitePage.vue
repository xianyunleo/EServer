<template>
  <div class="content-container">
    <div class="web-header piece">
      <a-button type="primary" @click="showAddWeb">添加网站</a-button>
      <input-with-search placeholder="请输入域名" style="width: 200px" @search="searchWeb"/>
    </div>

    <a-table :scroll="{y: true}"
             :columns="columns"
             :data-source="list"
             class="content-table web-table scroller"
             :pagination="false"
             size="middle">
      <template #bodyCell="{ column, text, record}">
        <template v-if="column.dataIndex === 'operate'">
          <div class="operate">
            <a-dropdown :trigger="['click']">
              <template #overlay>
                <a-menu>
                  <a-menu-item key="1" @click="showEditWeb">修改</a-menu-item>
                  <a-menu-item key="2">删除{{ text }}</a-menu-item>
                  <a-menu-item @click="browse(record)">浏览器访问</a-menu-item>
                  <a-menu-item @click="openRootPath(record)">打开根目录{{ column }}</a-menu-item>
                  <a-menu-item @click="openConfFile(record)">打开配置文件</a-menu-item>
<!--                  <a-menu-item >打开命令行终端</a-menu-item>-->
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
  <add-web-site-modal ref="addWebSiteModalRef" :searchWeb="searchWeb"/>
  <edit-web-site-modal ref="editWebSiteModalRef"/>
</template>

<script setup>
import {ref} from "vue";
import {DownOutlined} from '@ant-design/icons-vue';
import InputWithSearch from "@/components/InputWithSearch";
import AddWebSiteModal from "@/components/WebSite/AddWebSiteModal";
import EditWebSiteModal from "@/components/WebSite/EditWebSiteModal";
import Website from "@/main/Website";
import {openPath, openTextFile, openUrl} from "@/main/tools";

const columns = [
  {
    title: '网站域名',
    width: 160,
    dataIndex: 'serverName',
    ellipsis: true,
  }, {
    title: '根目录',
    dataIndex: 'path',
    ellipsis: true,
  }, {
    title: 'PHP版本',
    dataIndex: 'phpVersion',
    width: 80,
    align: 'center',
  }, {
    title: '操作',
    dataIndex: 'operate',
    width: 100,
    align: 'center',
  }
];

const addWebSiteModalRef = ref(null);
const editWebSiteModalRef = ref(null);

let list=ref([]);

const searchWeb = async (val) => {
  list.value  = await Website.getList(val);
}

(async () => {
  await searchWeb();
})();


const showAddWeb = () => {
  addWebSiteModalRef.value.visible = true;
};

const showEditWeb = () => {
  editWebSiteModalRef.value.visible = true;
}

const browse = async (item) => {
  await openUrl(`http://${item.serverName}`);
}

const openConfFile = async (item) => {
  await openTextFile(item.confPath);
}
const openRootPath = async (item) => {
  await openPath(item.path);
}


</script>

<style scoped lang="scss">
.web-header {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  padding: 15px 15px;
}

.web-table {
  display: flex;
  height: 0;

  :deep(.ant-spin-nested-loading) {
    display: flex;
  }

  :deep(.ant-spin-container) {
    display: flex;
  }

  :deep(.ant-table) {
    display: flex;
  }

  :deep( .ant-table-container) {
    display: flex;
    flex-direction: column;
  }

  :deep(.ant-table-header) {
    overflow: visible !important;
  }
}

</style>
