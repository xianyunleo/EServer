<template>
  <a-modal
      title="TCP端口进程列表"
      v-model:visible="visible"
      :bodyStyle="{height:'calc(100vh - 120px)'}"
      width="'calc(100vw - 100px)'"
      centered
      :footer="null"
      :maskClosable="false">
    <div class="modal-content">
      <div style="text-align:right">
        <a-button @click="search" :disabled="tableLoading">刷新</a-button>
      </div>
      <a-table :scroll="{y: 'calc(100vh - 240px)'}"
               :loading="tableLoading"
               :columns="columns"
               :data-source="list"
               class="content-table"
               :pagination="false"
               size="middle">
        <template #bodyCell="{ column, record}">
          <template v-if="column.dataIndex === 'operate'">
            <div class="operate">
              <a-dropdown :trigger="['click']">
                <template #overlay>
                  <a-menu>
                    <a-menu-item @click="kill(record)">杀死</a-menu-item>
                    <a-menu-item @click="openPath(record)">打开所在目录</a-menu-item>
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
  </a-modal>
</template>

<script setup>
import {computed, defineEmits, defineProps, ref} from "vue";
import ProcessExtend from "@/main/core/ProcessExtend";
import {DownOutlined} from '@ant-design/icons-vue';
import MessageBox from "@/renderer/utils/MessageBox";
import TcpProcess from "@/main/core/TcpProcess";
import Native from "@/renderer/utils/Native";
import OS from "@/main/core/OS";

const props = defineProps(['show']);
const emit = defineEmits(['update:show']);
const visible = computed({
  get() {
    return props.show;
  },
  set(value) {
    emit('update:show', value);
  }
})

const tableLoading = ref(false);

const columns = [
  {
    title: 'Name',
    width: 100,
    dataIndex: 'name',
    ellipsis: true,
  },
  {
    title: 'PID',
    width: 60,
    dataIndex: 'pid',
  },{
    title: 'IP',
    width: 120,
    dataIndex: 'ip',
  }, {
    title: 'Port',
    dataIndex: 'port',
    width: 80,
  }, {
    title: 'Status',
    dataIndex: 'status',
    width: 100,
  }, {
    title: 'Path',
    dataIndex: 'path',
    ellipsis: true,
  } , {
    title: 'Operate',
    dataIndex: 'operate',
    align: 'center',
    width: 100,
  }
];

if (!OS.isWindows()) {
  columns.splice(2, 0,
      {
        title: 'User',
        dataIndex: 'user',
        width: 60,
      },
      {
        title: 'Type',
        dataIndex: 'type',
        align: 'center',
        width: 60,
      })
}

const list = ref([]);

const search = async () => {
  tableLoading.value =true;
  try {
    list.value = await TcpProcess.getList();
  } catch (error) {
    MessageBox.error(error.message ?? error, '获取列表出错！');
  }
  tableLoading.value =false;
}

search();

const kill = async (item) => {
  await ProcessExtend.kill(item.pid);
  await search();
}

const openPath = async (item) => {
  await Native.showItemInFolder(item.path);
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
