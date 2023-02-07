<template>
  <div class="content-container">
    <div class="web-header piece">
      <a-button type="primary" @click="showAdd">添加网站</a-button>
      <input-with-search placeholder="请输入域名" style="width: 200px" @search="search"/>
    </div>

    <a-table :scroll="{y: 'calc(100vh - 170px)'}"
             :columns="columns"
             :data-source="list"
             class="content-table web-table scroller"
             :pagination="false"
             size="middle">
      <template #bodyCell="{ column, text, record}">
        <template v-if="column.dataIndex === 'serverName'">
          <div>{{record.serverName}}</div>
          <div v-if="record.extraServerName">{{record.extraServerName}}</div>
        </template>

        <template v-if="column.dataIndex === 'operate'">
          <div class="operate">
            <a-dropdown :trigger="['click']">
              <template #overlay>
                <a-menu>
                  <a-menu-item @click="showEdit(record)">修改</a-menu-item>
                  <a-menu-item @click="del(record)">删除{{ text }}</a-menu-item>
                  <a-menu-item @click="browse(record)">浏览器访问</a-menu-item>
                  <a-menu-item @click="openRootPath(record)">打开根目录</a-menu-item>
                  <a-menu-item @click="openConfFile(record)">打开配置文件</a-menu-item>
                  <a-menu-item @click="openRewriteConfFile(record)">打开rewrite配置文件</a-menu-item>
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
  <add-web-site-modal  />
  <edit-web-site-modal v-if="editModalVisible" /> <!--加v-if是为了后代组件重新加载，从而更新网站配置信息-->
</template>

<script setup>
import {ref,provide} from "vue";
import {DownOutlined} from '@ant-design/icons-vue';
import InputWithSearch from "@/renderer/components/InputWithSearch";
import AddWebSiteModal from "@/renderer/components/WebSite/AddWebSiteModal";
import EditWebSiteModal from "@/renderer/components/WebSite/EditWebSiteModal";
import Website from "@/main/core/website/Website";
import MessageBox from "@/renderer/utils/MessageBox";
import Native from "@/renderer/utils/Native";
import Hosts from "@/main/core/Hosts";
import OS from "@/main/core/OS";


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

const list = ref([]);
const serverName = ref('');
const addModalVisible = ref(false);
const editModalVisible = ref(false);

const search = async (val) => {
  try {
    list.value = await Website.getList(val);
  } catch (error) {
    MessageBox.error(error.message ?? error, '获取网站列表出错！');
  }
}

provide('website',{
  serverName,
  search,
  addModalVisible,
  editModalVisible,
});

search();

const del = async (item) => {
  try {
    let options = {
      content:'确定删除吗?',
      okText:'确定',
      cancelText:'取消',
    };
    if (await MessageBox.Confirm(options)) {
      Website.delete(item.serverName);
    }
   } catch (error) {
    MessageBox.error(error.message ?? error, '删除出错！');
    return;
  }

  if (item.allowSyncHosts) {
    try {
      await Hosts.delete([item.serverName, item.extraServerName]);
    } catch (error) {
      MessageBox.error(error.message ?? error, '同步Hosts出错！');
    }
  }

  search();
}

const showAdd = () => {
  addModalVisible.value = true;
};

const showEdit = (item) => {
  editModalVisible.value = true;
  serverName.value = item.serverName;
}

const browse = (item) => {
  Native.openUrl(`http://${item.serverName}`);
}

const openConfFile = async (item) => {
  Native.openTextFile(Website.getConfPath(item.serverName));
}
const openRewriteConfFile = (item) => {
  Native.openTextFile(Website.getRewriteConfPath(item.serverName));
}

const openRootPath = (item) => {
  let path = item.rootPath;
  if (OS.isWindows()) {
    path = path.replaceAll('/', '\\')
  }
  Native.openPath(path);
}


</script>

<style scoped lang="scss">
.web-header {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  padding: 15px 15px;
}

</style>
