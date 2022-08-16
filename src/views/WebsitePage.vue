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
                  <a-menu-item @click="showEditWeb(record)">修改</a-menu-item>
                  <a-menu-item @click="del(record)">删除{{ text }}</a-menu-item>
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
  <add-web-site-modal ref="addWebSiteModalRef" />
  <edit-web-site-modal ref="editWebSiteModalRef" :serverName="serverName"/>
</template>

<script setup>
import {ref,provide} from "vue";
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
    dataIndex: 'rootPath',
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

let list = ref([]);
let serverName = ref('');

const searchWeb = async (val) => {
  list.value = await Website.getList(val);
}

provide('searchWeb' , searchWeb);
provide('serverName' , serverName);

let addWebSiteModalRef = ref(null);
let editWebSiteModalRef = ref(null);

(async () => {
  await searchWeb();
})();

const del = async (item) => {
  await Website.delete(item.serverName);
  await searchWeb();
}

const showAddWeb = () => {
  addWebSiteModalRef.value.visible = true;
};

const showEditWeb = (item) => {
  editWebSiteModalRef.value.visible = true;
  serverName.value = item.serverName;
}

const browse = async (item) => {
  await openUrl(`http://${item.serverName}`);
}

const openConfFile = async (item) => {
  await openTextFile(Website.getConfPath(item.serverName));
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
