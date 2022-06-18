<template>
  <a-modal title="添加网站" ok-text="确认" cancel-text="取消" @ok="addWeb" :maskClosable="false">
    <div class="modal-content">
      <a-form
          :model="formData"
          name="basic"
          :label-col="{ span: 5}"
          :wrapper-col="{ span: 18 }"
          autocomplete="off"
          @finish="onFinish"
          @finishFailed="onFinishFailed"
      >
        <a-form-item label="域名" name="serverName" :rules="[{ required: true, message: '请输入域名!' }]" >
          <a-input v-model:value="formData.serverName"/>
        </a-form-item>

        <a-form-item label="端口" name="port" :rules="[{  required: true, type: 'number', min: 80, max: 65535 }]">
          <a-input-number v-model:value="formData.port" min="80" max="65535"/>
        </a-form-item>

        <a-form-item label="根目录" name="path" :rules="[{ required: true, message: '请选择根目录!' }]" >
          <a-input v-model:value="formData.path" class="with-btn"  readonly  >
            <template #suffix>
              <span class="icon-wrapper">
                 <folder-open-filled style="color: rgba(0, 0, 0, 0.45);" @click="selectPath"  />
              </span>
            </template>
          </a-input>

        </a-form-item>

        <a-form-item label="PHP版本" name="phpVersion" :rules="[{ required: true, message: '请选择PHP版本!' }]" >
          <a-input-password v-model:value="formData.phpVersion" />
        </a-form-item>
      </a-form>

    </div>
  </a-modal>
</template>

<script>
import {reactive,defineComponent} from "vue";
import {FolderOpenFilled} from "@ant-design/icons-vue";
import {openDirectoryDialog} from "@/electron/openDialog"
export default defineComponent({
  name: "AddWebSiteModal",
  components:{FolderOpenFilled},
  setup(){
    let formData = reactive({
      serverName: '',
      port: 80,
      path: '',
      phpVersion:'',
    });
    let selectPath = ()=>{
      formData.path = openDirectoryDialog();
    }
    return {formData,selectPath}
  }
})


</script>

<style scoped>
.modal-content {
  padding: 0 50px;
}
</style>