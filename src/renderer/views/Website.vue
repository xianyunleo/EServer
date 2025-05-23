<template>
  <div class="content-container">
    <a-card size="small">
      <div class="web-header">
        <a-button type="primary" @click="showAdd">{{ t('Add') }}</a-button>
        <div>
          {{ mt('Show', 'ws', 'Column') }}：
          <a-checkbox v-model:checked="store.websiteList.showSecondDomainName">
            {{ mt('Second', 'ws', 'DomainName') }}
          </a-checkbox>
          <a-checkbox v-model:checked="store.websiteList.showNote">
            {{ mt('Note') }}
          </a-checkbox>
        </div>
        <input-with-search :placeholder="mt('Input', 'ws', 'DomainName')" style="width: 200px" @search="search" />
      </div>
    </a-card>

    <a-table :scroll="{ y: 'calc(100vh - 220px)' }" :columns="columns" :data-source="list" class="content-table web-table scroller" :pagination="pagination" size="middle">
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.dataIndex === 'serverName'">
          <a class="non-draggable" @click="openUrl(record)">{{ text }}</a>
        </template>
        <template v-if="column.dataIndex === 'rootPath'">
          <a class="non-draggable color-text" @click="openRootPath(record)">{{ text }}</a>
        </template>
        <template v-if="column.dataIndex === 'operate'">
          <div class="operate">
            <a-dropdown :trigger="['click']">
              <template #overlay>
                <a-menu>
                  <a-menu-item @click="showEdit(record)">{{ t('Modify') }}</a-menu-item>
                  <a-menu-item @click="del(record)">{{ t('Delete') }}</a-menu-item>
                  <a-menu-item @click="openUrl(record)">{{ mt('Open', 'ws') }}URL</a-menu-item>
                  <a-menu-item @click="openRootPath(record)">{{ mt('Open', 'ws', 'RootPath') }}</a-menu-item>
                  <a-menu-item @click="openConfFile(record)">
                    {{ mt('Open', 'ws', 'Conf', 'ws', 'File') }}
                  </a-menu-item>
                  <a-menu-item @click="openRewriteConfFile(record)">
                    {{ mt('Open', 'ws', 'UrlRewrite', 'ws', 'File') }}
                  </a-menu-item>
                  <a-menu-item @click="openAccessLog(record)">
                    {{ mt('Open', 'ws', 'Access', 'ws', 'Log') }}
                  </a-menu-item>
                  <a-menu-item @click="openErrorLog(record)">
                    {{ mt('Open', 'ws', 'Error', 'ws', 'Log') }}
                  </a-menu-item>
                  <!--                  <a-menu-item >打开命令行终端</a-menu-item>-->
                </a-menu>
              </template>
              <a-button>{{ t('Manage') }}<DownOutlined /></a-button>
            </a-dropdown>
          </div>
        </template>
      </template>
    </a-table>
  </div>
  <add-web-site-modal v-if="addModalVisible" />
  <edit-web-site-modal v-if="editModalVisible" />
  <!--加v-if是为了后代组件重新加载，从而更新网站配置信息-->
</template>

<script setup>
import { ref, provide, computed } from 'vue'
import InputWithSearch from '@/renderer/components/Input/InputWithSearch.vue'
import AddWebSiteModal from '@/renderer/components/WebSite/AddWebSiteModal.vue'
import EditWebSiteModal from '@/renderer/components/WebSite/EditWebSiteModal.vue'
import Website from '@/main/services/website/Website'
import MessageBox from '@/renderer/utils/MessageBox'
import Opener from '@/renderer/utils/Opener'
import Hosts from '@/main/utils/Hosts'
import { mt, t } from '@/renderer/utils/i18n'
import { isWindows } from '@/main/utils/utils'
import { createAsyncComponent } from '@/renderer/utils/utils'
import { useMainStore } from '@/renderer/store'
import GetDataPath from '@/shared/utils/GetDataPath'
import path from 'path'

const store = useMainStore()
const AButton = createAsyncComponent(import('ant-design-vue'), 'Button')
const ADropdown = createAsyncComponent(import('ant-design-vue'), 'Dropdown')
const DownOutlined = createAsyncComponent(import('@ant-design/icons-vue'), 'DownOutlined')

const pagination = {
  defaultPageSize: 10,
  showSizeChanger: true,
  showTotal: (total) => `Total ${total} items`
}

const columns = computed(() => {
  return [
    {
      title: t('DomainName'),
      width: 150,
      dataIndex: 'serverName',
      ellipsis: true
    },
    {
      title: mt('Second', 'ws', 'DomainName'),
      width: 120,
      dataIndex: 'extraServerName',
      ellipsis: true,
      hidden: !store.websiteList.showSecondDomainName
    },
    {
      title: mt('Note'),
      width: 120,
      dataIndex: 'note',
      ellipsis: true,
      hidden: !store.websiteList.showNote
    },
    {
      title: t('Port'),
      width: 60,
      dataIndex: 'port'
    },
    {
      title: t('RootPath'),
      dataIndex: 'rootPath',
      ellipsis: true
    },
    {
      title: `PHP`,
      dataIndex: 'phpVersion',
      width: 80,
      align: 'center'
    },
    {
      title: t('Operation'),
      dataIndex: 'operate',
      width: 120,
      align: 'center'
    }
  ].filter((item) => !item.hidden)
})

const list = ref([])
const confName = ref('')
const serverName = ref('')
const port = ref('')
const addModalVisible = ref(false)
const editModalVisible = ref(false)

const search = async (val) => {
  try {
    val = val ? val.trim() : ''
    const tempList = await Website.getList(val)
    for (const item of tempList) {
      if (!item.phpVersion) item.phpVersion = t('Static')
    }
    list.value = tempList
  } catch (error) {
    MessageBox.error(error.message ?? error, t('Error getting site list!'))
  }
}

provide('WebsiteProvide', {
  confName,
  serverName,
  port,
  search,
  addModalVisible,
  editModalVisible
})

search()

const del = async (item) => {
  try {
    let options = {
      content: t('Delete') + ` ${item.serverName}:${item.port} ？`,
      okText: t('Confirm'),
      cancelText: t('Cancel')
    }
    if (await MessageBox.confirm(options)) {
      await Website.delete(item.confName)
    }
  } catch (error) {
    MessageBox.error(error.message ?? error, '删除出错！')
    return
  }

  if (item.syncHosts) {
    const { serverName, extraServerName } = item
    syncHosts(serverName, extraServerName)
  }

  search()
}

async function syncHosts(serverName, extraServerName) {
  try {
    if (!(await Website.exists(serverName))) {
      await Hosts.delete(serverName)
    }

    if (extraServerName && !(await Website.exists(extraServerName))) {
      await Hosts.delete(extraServerName)
    }
  } catch {
    /* empty */
  }
}

const showAdd = () => {
  addModalVisible.value = true
}

const showEdit = (item) => {
  editModalVisible.value = true
  confName.value = item.confName
  serverName.value = item.serverName
  port.value = item.port
}

const openUrl = (item) => {
  Opener.openUrl(`http://${item.serverName}:${item.port}`)
}

const openConfFile = async (item) => {
  Opener.openTextFile(Website.getConfPath(item.confName))
}
const openRewriteConfFile = (item) => {
  Opener.openTextFile(Website.getRewriteConfPath(item.confName))
}

const openRootPath = (item) => {
  let path = item.rootPath
  if (isWindows) {
    path = path.replaceAll('/', '\\')
  }
  Opener.openDirectory(path)
}

const openAccessLog = (item) => {
  const filePath = path.join(GetDataPath.getNginxLogsDir(), `${item.serverName}_${item.port}.access.log`)
  Opener.openTextFile(filePath)
}

const openErrorLog = (item) => {
  const filePath = path.join(GetDataPath.getNginxLogsDir(), `${item.serverName}_${item.port}.error.log`)
  Opener.openTextFile(filePath)
}
</script>

<style scoped>
.web-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
:deep(td) {
  height: 57px;
}
:deep(.ant-table-pagination) {
  margin: 6px 10px !important;
}
</style>
