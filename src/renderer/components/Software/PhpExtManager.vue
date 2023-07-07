<template>
  <a-modal
      :title="`PHP-${props.phpVersion} 扩展管理`"
      v-model:visible="visible"
      centered
      :footer="null"
      :maskClosable="false">
    <div class="modal-content">
      <a-table
               :columns="columns"
               :data-source="list"
               class="content-table"
               :pagination="false"
               size="middle">
        <template #bodyCell="{ column,record}">
          <template v-if="column.dataIndex === 'operate'">
            <div class="operate">
              <a-button  type="primary" @click="execScript(record)">执行安装脚本</a-button>
            </div>
          </template>
        </template>
      </a-table>
    </div>
  </a-modal>

  <a-modal
      :title="`安装PHP-${props.phpVersion} 扩展任务`"
      v-model:visible="taskVisible"
      centered
      :footer="null"
      :maskClosable="false">
    <div class="modal-content">
      <a-table
          :columns="columns"
          :data-source="list"
          class="content-table"
          :pagination="false"
          size="middle">
        <template #bodyCell="{ column,record}">
          <template v-if="column.dataIndex === 'operate'">
            <div class="operate">
              <a-button  type="primary" @click="execScript(record)">执行安装脚本</a-button>
            </div>
          </template>
        </template>
      </a-table>
    </div>
  </a-modal>
</template>

<script setup>
import {computed, defineEmits, defineProps, ref} from "vue";
import Command from "@/main/core/Command";
import Path from "@/main/utils/Path";
import GetPath from "@/shared/utils/GetPath";

const props = defineProps(['show','phpVersion']);

console.log(props.phpVersion)
const emit = defineEmits(['update:show']);
const visible = computed({
  get() {
    return props.show;
  },
  set(value) {
    emit('update:show', value);
  }
});

const taskVisible = ref(false);


const columns = [
  {
    title: '名称',
    width: 180,
    dataIndex: 'name',
  },{
    title: '操作',
    dataIndex: 'operate',
    align: 'center',
  }
];

const list = [
  {
    name: 'redis',
    scriptName: 'redis.sh',
  }, {
    name: 'swoole',
    scriptName: 'swoole.sh',
  }
];

// eslint-disable-next-line no-unused-vars


const execScript = (item) => {
  // let appPath = '/System/Applications/Utilities/Terminal.app';
  // let filePath = Path.Join(GetPath.getScriptDir(), 'phpext', item.scriptName);
  // let command = `open -a "${appPath}" "${filePath}"`;
  // Command.sudoExec(command);
}
</script>