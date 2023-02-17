<template>
  <a-form
      :model="formData"
      name="basic"
      :label-col="{ span: 5}"
      :wrapper-col="{ span: 18 }"
      autocomplete="off">

    <a-form-item label="第二域名" name="extraServerName" >
      <a-input v-model:value="formData.extraServerName" @change="extraServerNameChange"  placeholder="可以不填" />
    </a-form-item>

    <a-form-item label="端口" name="port" :rules="[{  required: true, type: 'number', min: 80, max: 65535 }]">
      <a-input-number v-model:value="formData.port" min="80" max="65535"  />
    </a-form-item>

    <a-form-item label="根目录" name="path" :rules="[{ required: true, message: '请选择根目录!' }]">
      <input-open-dir-dialog v-model:value="formData.rootPath" :showForwardSlash="true" ></input-open-dir-dialog>
    </a-form-item>

    <a-form-item label="PHP版本" name="phpVersion" >
      <a-select  style="width: 120px" v-model:value="formData.phpVersion" :options="phpVersionList">
      </a-select>
    </a-form-item>

    <a-form-item label="同步hosts" name="allowSyncHosts">
      <a-switch v-model:checked="formData.allowSyncHosts" :disabled="true" />
    </a-form-item>
  </a-form>

  <div style="text-align: center">
    <a-button type="primary" @click="save">保存</a-button>
  </div>
</template>

<script setup>
// eslint-disable-next-line no-unused-vars
import {ref, inject, reactive} from "vue";
import InputOpenDirDialog from "@/renderer/components/InputOpenDirDialog";
import Website from "@/main/core/website/Website";
import {message} from "ant-design-vue";
import MessageBox from "@/renderer/utils/MessageBox";
import {STATIC_WEB_NAME} from "@/shared/constant";
import SoftwareExtend from "@/main/core/software/SoftwareExtend";
//import path from "path";
import Hosts from "@/main/core/Hosts";

const {serverName,search} = inject('website');

const formData = reactive({});
const phpVersionList = ref([]);

let websiteInfo = Website.getBasicInfo(serverName.value);
Object.assign(formData, websiteInfo)

let list = SoftwareExtend.getPHPList();
phpVersionList.value = list.map(item => {
  return {value: item.version, label: item.name};
});
phpVersionList.value.push({value: '', label: STATIC_WEB_NAME});

const save = async () => {
  try {
    await Website.saveBasicInfo(serverName.value, formData);
    message.info('保存成功');
    search();
  }catch (error){
    MessageBox.error(error.message ?? error, '保存出错！');
  }

  if(websiteInfo.allowSyncHosts){
    try {
      if(formData.extraServerName == websiteInfo.extraServerName){
        return;
      }
      if(websiteInfo.extraServerName){
        await Hosts.delete([websiteInfo.extraServerName]);
      }
      if(formData.extraServerName){
        await Hosts.add([formData.extraServerName]);
      }
    } catch (error) {
      MessageBox.error(error.message ?? error, '同步Hosts出错！');
    }
  }

  websiteInfo = JSON.parse(JSON.stringify(formData));

}

const extraServerNameChange = () => {
  formData.extraServerName = formData.extraServerName?.trim();
}
</script>

<style scoped>

</style>
