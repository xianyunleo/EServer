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
              <a-button type="primary" @click="install(record)">安装</a-button>
            </div>
          </template>
        </template>
      </a-table>
    </div>
  </a-modal>

  <a-modal
      :title="`安装PHP-${props.phpVersion} 扩展任务，请确保已安装了brew`"
      v-model:visible="taskVisible" @cancel="cancel()"
      :bodyStyle="{height:'calc(100vh - 120px)'}"
      width="800px"
      centered :footer="null" :maskClosable="false">
    <div class="modal-content" >
      <pre class="command-out">
        {{msg}}
      </pre>
    </div>
  </a-modal>
</template>

<script setup>
import {computed, defineEmits, defineProps, ref} from "vue";

import Installer from "@/main/core/php/extension/Installer";
import {EventEmitter} from "events";

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
const msg = ref('');

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
    extFileName :'swoole.so'
  }, {
    name: 'swoole',
    extFileName :'swoole.so'
  }
];


let installer;
let eventEmitter;
const install = (item) => {
  taskVisible.value =true;
  // eslint-disable-next-line no-unreachable
  eventEmitter = new EventEmitter();
  installer = new Installer(item.name, props.phpVersion,eventEmitter);
  installer.install();
  eventEmitter.on('phpExt:stdout',(data)=>{
    msg.value += `${data}\n`;
  })

  // eslint-disable-next-line no-unreachable
  eventEmitter.on('phpExt:stderr',(data)=>{
    msg.value += data;
  })
}

const cancel = ()=>{
  installer?.stop();
  msg.value = '';
}
</script>
<style scoped lang="scss">
  .command-out{
    display:flex;
    flex-direction:column-reverse;
    background:#333;
    color:#fff;
    white-space:pre-wrap;
    word-break:break-all;
    overflow:auto;
    height:calc(100vh - 180px);
  }
</style>
