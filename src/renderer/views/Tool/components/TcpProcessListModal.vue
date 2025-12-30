<template>
  <a-modal
    :title="`Tcp${mt('ws', 'Port', 'ws', 'Process', 'ws', 'List')}`"
    v-model:open='visible'
    :bodyStyle="{height:'calc(100vh - 120px)'}" width='100vw'
    centered :footer='null' :maskClosable='false'>
    <div class='modal-content'>
      <div style='text-align:right'>
        <a-button @click='search' type='primary' :disabled='tableLoading'>{{ t('Refresh') }}</a-button>
      </div>
      <a-table :scroll="{y: 'calc(100vh - 240px)'}"
               :loading='tableLoading'
               :columns='columns'
               :data-source='list'
               class='content-table'
               :pagination='false'
               size='middle'>
        <template #bodyCell='{ column, record}'>
          <template v-if="column.dataIndex === 'icon'">
            <img v-if='record.icon' :src='record.icon' alt='icon'>
          </template>
          <template v-if="column.dataIndex === 'operate'">
            <div class='operate'>
              <a-dropdown :trigger="['click']">
                <template #overlay>
                  <a-menu>
                    <a-menu-item @click='kill(record)'>{{ t('Kill') }}</a-menu-item>
                    <a-menu-item @click='openPath(record)'>{{ mt('Open', 'ws', 'Directory') }}</a-menu-item>
                  </a-menu>
                </template>
                <a-button>{{ t('Manage') }}
                  <DownOutlined />
                </a-button>
              </a-dropdown>
            </div>
          </template>
        </template>
      </a-table>
    </div>
  </a-modal>
</template>

<script setup>
import { computed, ref } from 'vue'
import ProcessExtend from '@/main/utils/ProcessExtend'
import { DownOutlined } from '@ant-design/icons-vue'
import MessageBox from '@/renderer/utils/MessageBox'
import TcpProcess from '@/main/utils/TcpProcess'
import Opener from '@/renderer/utils/Opener'
import { message } from 'ant-design-vue'
import { isWindows } from '@/shared/utils/utils2'
import { mt, t } from '@/renderer/utils/i18n'

const props = defineProps({ show: Boolean })
const emit = defineEmits(['update:show'])
const visible = computed({
  get() {
    return props.show
  },
  set(value) {
    emit('update:show', value)
  }
})

const tableLoading = ref(false)

const columns = [
  {
    title: t('Name'),
    width: 120,
    dataIndex: 'name',
    ellipsis: true,
    sorter: (a, b) => a.name.localeCompare(b.name)
  },
  {
    title: 'PID',
    width: 80,
    dataIndex: 'pid',
    sorter: (a, b) => a.pid - b.pid
  }, {
    title: 'IP',
    width: 120,
    dataIndex: 'ip'
  }, {
    title: t('Port'),
    dataIndex: 'port',
    width: 80,
    sorter: (a, b) => a.port - b.port,
    defaultSortOrder: 'ascend'
  }, {
    title: t('Status'),
    dataIndex: 'status',
    width: 60
  }, {
    title: t('Path'),
    dataIndex: 'path',
    ellipsis: true
  }, {
    title: t('Operation'),
    dataIndex: 'operate',
    align: 'center',
    width: 110
  }
]

if (isWindows) {
  columns.unshift({
    title: 'Icon',
    dataIndex: 'icon',
    width: 50
  })
} else {
  columns.splice(2, 0,
    {
      title: 'User',
      dataIndex: 'user',
      width: 60
    },
    {
      title: 'Type',
      dataIndex: 'type',
      align: 'center',
      width: 60
    })
}

const list = ref([])

const search = async () => {
  tableLoading.value = true
  try {
    list.value = await TcpProcess.getList(true)
  } catch (error) {
    MessageBox.error(error.message ?? error, '获取列表出错！')
  }
  tableLoading.value = false
}

search()

const kill = async (item) => {
  if (isWindows) {
    const processArr = ['System', 'wininit', 'services', 'svchost', 'Idle', 'lsass', 'spoolsv']
    if (processArr.includes(item.name)) {
      message.warn(`不能杀死系统进程'${item.name}'！`)
      return
    }
  }
  await ProcessExtend.kill(item.pid, true)
  await search()
}

const openPath = async (item) => {
  if (item.path) {
    await Opener.showItemInFolder(item.path)
  }
}
</script>

<style scoped>
.modal-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.content-table {
  flex: 1;
}
</style>
