<template>
  <div class="content-container">
    <a-card>
      <div class='web-header' >
        <a-button type="primary" @click="showAdd">{{t("Add")}}</a-button>
        <input-with-search :placeholder="mt('Input','ws','DomainName')"
                           style='width: 200px' @search='search' />
      </div>
    </a-card>

    <a-table :scroll="{y: 'calc(100vh - 180px)'}"
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
                  <a-menu-item @click="showEdit(record)">{{t('Modify')}}</a-menu-item>
                  <a-menu-item @click="del(record)">{{t('Delete')}}</a-menu-item>
                  <a-menu-item @click="openUrl(record)">{{mt('Open','ws')}}URL</a-menu-item>
                  <a-menu-item @click="openRootPath(record)">{{mt('Open','ws','RootPath')}}</a-menu-item>
                  <a-menu-item @click="openConfFile(record)">
                    {{mt('Open','ws','Conf','ws','File')}}
                  </a-menu-item>
                  <a-menu-item @click="openRewriteConfFile(record)">
                    {{mt('Open','ws','UrlRewrite','ws','File')}}
                  </a-menu-item>
                  <!--                  <a-menu-item >打开命令行终端</a-menu-item>-->
                </a-menu>
              </template>
              <a-button>{{t('Manage')}}<DownOutlined/></a-button>
            </a-dropdown>
          </div>
        </template>
      </template>
    </a-table>
  </div>
  <add-web-site-modal  v-if="addModalVisible" />
  <edit-web-site-modal v-if="editModalVisible" /> <!--加v-if是为了后代组件重新加载，从而更新网站配置信息-->
</template>

<script setup>
import {ref, provide, defineAsyncComponent} from "vue";
import {DownOutlined} from '@ant-design/icons-vue';
import InputWithSearch from "@/renderer/components/Input/InputWithSearch.vue";
import AddWebSiteModal from "@/renderer/components/WebSite/AddWebSiteModal.vue";
import EditWebSiteModal from "@/renderer/components/WebSite/EditWebSiteModal.vue";
import Website from "@/main/core/website/Website";
import MessageBox from "@/renderer/utils/MessageBox";
import Native from "@/main/utils/Native";
import Hosts from "@/main/utils/Hosts";
import { mt, t } from '@/shared/utils/i18n'
import { isWindows } from '@/main/utils/utils'

const ADropdown = defineAsyncComponent(() => {
  return new Promise((resolve) => {
    import('ant-design-vue').then((modules) => {
      resolve(modules.Dropdown)
    })
  })
})
const AMenu = defineAsyncComponent(() => {
  return new Promise((resolve) => {
    import('ant-design-vue').then((modules) => {
      resolve(modules.Menu)
    })
  })
})
const AMenuItem = defineAsyncComponent(() => {
  return new Promise((resolve) => {
    import('ant-design-vue').then((modules) => {
      resolve(modules.MenuItem)
    })
  })
})

const columns = [
  {
    title: t('DomainName'),
    width: 160,
    dataIndex: 'serverName',
    ellipsis: true,
  },
  {
    title: t('Port'),
    width: 60,
    dataIndex: 'port',
  },{
    title: t('RootPath'),
    dataIndex: 'rootPath',
    ellipsis: true,
  }, {
    title: `PHP`,
    dataIndex: 'phpVersion',
    width: 80,
    align: 'center',
  }, {
    title:  t('Operation'),
    dataIndex: 'operate',
    width: 120,
    align: 'center',
  }
];

const list = ref([]);
const confName = ref('');
const serverName = ref('');
const port = ref('');
const addModalVisible = ref(false);
const editModalVisible = ref(false);

const search = async (val) => {
  try {
    const tempList = await Website.getList(val)
    for (const item of tempList) {
      if (!item.phpVersion) item.phpVersion = t('Static')
    }
    list.value = tempList
  } catch (error) {
    MessageBox.error(error.message ?? error, '获取网站列表出错！');
  }
}

provide('WebsiteProvide',{
  confName,
  serverName,
  port,
  search,
  addModalVisible,
  editModalVisible,
});

search();

const del = async (item) => {
  try {
    let options = {
      content:t('areYouSure'),
      okText:t('Confirm'),
      cancelText:t('Cancel'),
    };
    if (await MessageBox.confirm(options)) {
      Website.delete(item.confName);
    }
   } catch (error) {
    MessageBox.error(error.message ?? error, '删除出错！');
    return;
  }

  if (item.syncHosts) {
    try {
      if (await Website.getSameDomainAmount(item.serverName) === 0) {
        await Hosts.delete(item.serverName);
      }

      if (item.extraServerName && await Website.getSameDomainAmount(item.extraServerName) === 0) {
        await Hosts.delete(item.extraServerName);
      }
    } catch (error) {
      MessageBox.error(error.message ?? error, t('anErrorOccurredDuring', [mt('sync', 'ws') + 'hosts']))
    }
  }

  search();
}

const showAdd = () => {
  addModalVisible.value = true;
};

const showEdit = (item) => {
  editModalVisible.value = true;
  confName.value = item.confName;
  serverName.value = item.serverName;
  port.value = item.port;
}

const openUrl = (item) => {
  Native.openUrl(`http://${item.serverName}:${item.port}`);
}

const openConfFile = async (item) => {
  Native.openTextFile(Website.getConfPath(item.confName));
}
const openRewriteConfFile = (item) => {
  Native.openTextFile(Website.getRewriteConfPath(item.confName));
}

const openRootPath = (item) => {
  let path = item.rootPath;
  if (isWindows) {
    path = path.replaceAll('/', '\\')
  }
  Native.openDirectory(path);
}
</script>

<style scoped>
.web-header {
  display: flex;
  justify-content: space-between;
  //padding: 15px 15px;
}

</style>
