<template>
  <a-modal
      title="MySQL修改密码"
      ok-text="确认"
      cancel-text="取消"
      @ok="reset"
      v-model:visible="visible"
      centered
      :maskClosable="false">
    <div class="modal-content">
      <h4 style="text-align: center">
        当前MySQL版本：MySQL-5.7
      </h4>
      <a-form
          ref="formRef"
          :label-col="{ span: 5}"
          :wrapper-col="{ span: 18 }"
          autocomplete="off">
        <a-form-item label="新密码">
          <a-input v-model:value="newPwd"/>
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<script setup>
import {ref,defineExpose} from "vue";

let visible = ref(false);
let newPwd = ref('');
const reset = () => {
  console.log(newPwd)
};


defineExpose({visible});
</script>

<style scoped>

</style>