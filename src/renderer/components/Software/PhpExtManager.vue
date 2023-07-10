<template>
  <a-modal
      :title="`PHP-${props.phpVersion} 扩展管理`"
      v-model:visible="visible"
      centered :footer="null" :maskClosable="false">
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
              <a-button type="primary" @click="install(record)" v-show="!record.isInstalled">安装</a-button>
              <a-button type="primary" disabled v-show="record.isInstalled">已安装</a-button>
            </div>
          </template>
        </template>
      </a-table>
      <div class="flex-horizontal-center">
        <a-button type="primary" @click="openExtDir">打开扩展目录</a-button>
      </div>

    </div>
  </a-modal>

  <a-modal
      :title="`安装PHP-${props.phpVersion} 扩展任务，请确保已安装了brew`"
      v-model:visible="taskVisible" @cancel="closeTaskDialog()"
      :bodyStyle="{height:'calc(100vh - 120px)'}" width="100vw"
      centered :footer="null" :maskClosable="false">
    <div class="modal-content" >
      <pre class="command-out">{{msg}}</pre>
      <div :class="`result ${resultCode==0?'result-success':'result-error'}`">{{result}}</div>
    </div>
  </a-modal>
</template>

<script setup>
import {computed, defineEmits, defineProps, ref} from "vue";
import {EventEmitter} from "events";
import Installer from "@/main/core/php/extension/Installer";
import Extension from "@/main/core/php/extension/Extension";
import Native from "@/renderer/utils/Native";
import Php from "@/main/core/php/Php";

const props = defineProps(['show','phpVersion']);

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
const result = ref('');
const resultCode = ref(0);


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

const list = ref([]);

const isWindows = OS.isWindows();

const updateList = async () => {
  list.value = [];
  list.value = await Extension.getList(props.phpVersion);
}

updateList();


const openExtDir = ()=>{
  Native.openDirectory(Php.getExtensionDir(props.phpVersion));
}


let installer;
let eventEmitter;
const install = (item) => {
  taskVisible.value =true;
  eventEmitter = new EventEmitter();
  installer = new Installer(item.name, props.phpVersion,eventEmitter);
  let command = installer.install();
  if(!isWindows){
    msg.value += `执行安装扩展的命令\n${command}\n如果安装失败, 可尝试复制命令自行安装\n\n`;
  }

  eventEmitter.on('phpExt:stdout',(data)=>{
    if(taskVisible.value){
      msg.value += data;
    }
  })

  eventEmitter.on('phpExt:stderr',(data)=>{
    if(taskVisible.value){
      msg.value += data;
    }
  })

  eventEmitter.on('phpExt:exit', (code) => {
    if(taskVisible.value){
      resultCode.value = code;
      result.value = code == 0 ? '安装完成' : '安装失败';
    }
  })
}

const closeTaskDialog = () => {
  installer?.stop();
  msg.value = '';
  result.value = '';
  resultCode.value = 0;
  updateList();
}
</script>
<style scoped lang="scss">
  .flex-horizontal-center {
    display: flex;
    justify-content: center
  }
  .command-out{
    display:flex;
    flex-direction:column-reverse;
    height:calc(100vh - 200px);
    padding:10px;
    background:#333;
    color:#fff;
    white-space:pre-wrap;
    word-break:break-all;
    overflow:auto;
    user-select: text;
  }
  .result{
    height: 20px;
    line-height: 20px;
    text-align: center;
  }
  .result-success {
    @extend .result;
    color: green;
  }

  .result-error {
    @extend .result;
    color: red;
  }
</style>
