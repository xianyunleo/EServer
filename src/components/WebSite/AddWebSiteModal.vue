<template>
  <a-modal
      title="添加网站"
      ok-text="确认"
      cancel-text="取消"
      @ok="addWebClick"
      v-model:visible="visible"
      :maskClosable="false">
    <div class="modal-content">
      <a-form
          ref="formRef"
          :model="formData"
          name="basic"
          :label-col="{ span: 5}"
          :wrapper-col="{ span: 18 }"
          autocomplete="off">
        <a-form-item label="域名" name="serverName" :rules="[{ required: true, message: '请输入域名!' }]">
          <a-input v-model:value="formData.serverName" @change="serverNameChange"/>
        </a-form-item>

        <a-form-item label="端口" name="port" :rules="[{  required: true, type: 'number', min: 80, max: 65535 }]">
          <a-input-number v-model:value="formData.port" min="80" max="65535"/>
        </a-form-item>

        <a-form-item label="根目录" name="path" :rules="[{ required: true, message: '请选择根目录!' }]">
          <a-input v-model:value="formData.path" class="with-btn" readonly>
            <template #suffix>
              <span class="icon-wrapper" @click="selectPath">
                 <folder-open-filled style="color: rgba(0, 0, 0, 0.45);" />
              </span>
            </template>
          </a-input>

        </a-form-item>

        <a-form-item label="PHP版本" name="phpVersion" >
          <a-select style="width: 100px" v-model:value="formData.phpVersion" :options="phpVersionList" />
        </a-form-item>
      </a-form>

    </div>
  </a-modal>
</template>


<script setup>
import {defineExpose, ref, reactive,defineProps} from "vue";
import {FolderOpenFilled} from "@ant-design/icons-vue";
import {openDirectoryDialog} from "@/main/openDialog"
import path from "path";
import Website from "@/main/Website";
import {getWWWPath} from "@/main/getPath";
import MessageBox from "@/main/MessageBox";

const props = defineProps({
  searchWeb: { type: Function, required: true },
})


let wwwPath = getWWWPath();
const formRef = ref();
let visible = ref(false);
let formData = reactive({
  serverName: '',
  port: 80,
  path: wwwPath,
  phpVersion: '',
});

let phpVersionList = ref([]);
(async () => {
  let list =  await Website.getPHPVersionList();
  phpVersionList.value = list.map(item => {
    return {value: item.version, label: item.name};
  });
})();

let selectPath = () => {
  let path = openDirectoryDialog();
  if (path) {
    formData.path = path;
  }
}

const serverNameChange = ()=>{
  formData.path = path.join(wwwPath,formData.serverName);
}

const addWebClick = async () => {
  try {
    let values = await formRef.value.validateFields();
    visible.value = false;
    formRef.value.resetFields();
    await addWeb(values);
  } catch (errorInfo) {
    console.log('Failed:', errorInfo);
  }
};

const addWeb = async (webServerInfo) => {
  try{
    await Website.add(webServerInfo);
    await props.searchWeb();
  }catch (error){
    MessageBox.error(error.message);
  }
}

defineExpose({visible});
</script>

<style scoped>
.modal-content {
  padding: 0 5px;
}
</style>
