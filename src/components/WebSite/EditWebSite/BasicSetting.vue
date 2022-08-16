<template>
  <a-form
      :model="formData"
      name="basic"
      :label-col="{ span: 5}"
      :wrapper-col="{ span: 18 }"
      autocomplete="off">


    <a-form-item label="端口" name="port" :rules="[{  required: true, type: 'number', min: 80, max: 65535 }]">
      <a-input-number v-model:value="formData.port" min="80" max="65535"  />
    </a-form-item>

    <a-form-item label="根目录" name="path" :rules="[{ required: true, message: '请选择根目录!' }]">
      <input-open-dir-dialog v-model:value="formData.rootPath" ></input-open-dir-dialog>
    </a-form-item>

    <a-form-item label="PHP版本" name="phpVersion" >
      <a-select  style="width: 100px" v-model:value="formData.phpVersion" :options="phpVersionList">
      </a-select>
    </a-form-item>
  </a-form>

  <div style="text-align: center">
    <a-button type="primary" @click="save">保存</a-button>
  </div>
</template>

<script setup>
// eslint-disable-next-line no-unused-vars
import {reactive, ref, defineProps, watch, toRef,inject,onUpdated} from "vue";
import InputOpenDirDialog from "@/components/InputOpenDirDialog";
import Website from "@/main/Website";
import {message} from "ant-design-vue";
import MessageBox from "@/main/MessageBox";
//import {openDirectoryDialog} from "@/main/openDialog";
//import Website from "@/main/Website";

const serverName = inject('serverName');
const searchWeb = inject('searchWeb')


const save = async () => {
  try {
    await Website.saveBasicInfo(serverName, formData.value);
    message.info('保存成功');
    searchWeb();
  }catch (error){
    MessageBox.error(`保存失败，${error.message}`)
  }
}

let phpVersionList = ref([]);
(async () => {
  let list = await Website.getPHPVersionList();
  phpVersionList.value = list.map(item => {
    return {value: item.version, label: item.name};
  });
})();

</script>

<style scoped>

</style>
