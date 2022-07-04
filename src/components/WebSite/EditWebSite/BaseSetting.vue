<template>
  <a-form
      :model="formData"
      name="basic"
      :label-col="{ span: 5}"
      :wrapper-col="{ span: 18 }"
      autocomplete="off">
    <a-form-item label="域名" name="serverName" :rules="[{ required: true, message: '请输入域名!' }]">
      <a-input v-model:value="formData.serverName"/>
    </a-form-item>

    <a-form-item label="端口" name="port" :rules="[{  required: true, type: 'number', min: 80, max: 65535 }]">
      <a-input-number v-model:value="formData.port" min="80" max="65535"  />
    </a-form-item>

    <a-form-item label="根目录" name="path" :rules="[{ required: true, message: '请选择根目录!' }]">
      <a-input v-model:value="formData.path" class="with-btn" readonly>
        <template #suffix>
              <span class="icon-wrapper">
                 <folder-open-filled style="color: rgba(0, 0, 0, 0.45);" @click="selectPath"/>
              </span>
        </template>
      </a-input>

    </a-form-item>

    <a-form-item label="PHP版本" name="phpVersion" >
      <a-select
          :options = "phpOptions"
          style="width: 120px"
          v-model:value="formData.phpVersion"
      >
      </a-select>
    </a-form-item>
  </a-form>

  <div style="text-align: center">
    <a-button type="primary">保存</a-button>
  </div>
</template>

<script setup>
import {reactive,ref}  from "vue";
import {FolderOpenFilled} from "@ant-design/icons-vue";
import {openDirectoryDialog} from "@/main/openDialog";

let formData = reactive({
  serverName: '',
  port: 80,
  path: '',
  phpVersion: '',
})

let phpOptions = ref([
  {
    value: 'jack',
    label: 'php-7.1',
  }, {
    value: 'lucy',
    label: 'php-7.2',
  },
])

let selectPath = () => {
  let path = openDirectoryDialog();
  if (path) {
    formData.path = path;
  }
}
</script>

<style scoped>

</style>
