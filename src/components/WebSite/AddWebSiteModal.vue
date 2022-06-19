<template>
  <a-modal
      title="添加网站"
      ok-text="确认"
      cancel-text="取消"
      @ok="addWeb"
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
          <a-input v-model:value="formData.serverName"/>
        </a-form-item>

        <a-form-item label="端口" name="port" :rules="[{  required: true, type: 'number', min: 80, max: 65535 }]">
          <a-input-number v-model:value="formData.port" min="80" max="65535"/>
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

        <a-form-item label="PHP版本" name="phpVersion" :rules="[{ required: true, message: '请选择PHP版本!' }]">
          <a-input-password v-model:value="formData.phpVersion"/>
        </a-form-item>
      </a-form>

    </div>
  </a-modal>
</template>


<script setup>
  import {defineExpose, ref, reactive, toRaw} from "vue";
  import {FolderOpenFilled} from "@ant-design/icons-vue";
  import {openDirectoryDialog} from "@/electron/openDialog"

  const formRef = ref();
  let visible = ref(false);
  let formData = reactive({
    serverName: '',
    port: 80,
    path: '',
    phpVersion: '',
  });
  let selectPath = () => {
    let path = openDirectoryDialog();
    if (path) {
      formData.path = path;
    }
  }

  const addWeb = () => {
    formRef.value.validateFields().then(values => {
      console.log('Received values of form: ', values);
      console.log('formState: ', toRaw(formData));
       visible.value = false;
      formRef.value.resetFields();
    }).catch(info => {
      console.log('Validate Failed:', info);
    });
  };

  defineExpose({visible});
</script>

<style scoped>
.modal-content {
  padding: 0 50px;
}
</style>