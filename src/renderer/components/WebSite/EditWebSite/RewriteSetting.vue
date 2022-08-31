<template>
  <a-form
      name="rewrite"
      :label-col="{ span: 0}"
      :wrapper-col="{ span: 24 }"
      autocomplete="off">

    <a-form-item label="">
      <a-select
          v-model:value="formData.rewriteSelected"
          :options = "rewriteList"
          style="width: 120px"
          @change="rewriteSelectChange"
      >
      </a-select>
    </a-form-item>
    <a-form-item label="">
      <a-textarea v-model:value="formData.rewriteContent" :auto-size="{ minRows: 8, maxRows: 8}" />
    </a-form-item>
  </a-form>

  <div style="text-align: center">
    <a-button type="primary" @click="save">保存</a-button>
  </div>
</template>

<script setup>
// eslint-disable-next-line no-unused-vars
import {ref,inject}  from "vue";
import Website from "@/main/core/website/Website";
import MessageBox from "@/renderer/utils/MessageBox";
import {message} from "ant-design-vue";

const {serverName} = inject('website');

const formData = ref({
  rewriteSelected: 0,
  rewriteContent: '',
});
const rewriteList = ref([]);

const getRewrite = () => {
  return Website.getRewrite(serverName.value);
}

(async () => {
  formData.value.rewriteContent = getRewrite();
  let list = await Website.getRewriteRuleList();
  rewriteList.value = list.map(item => {
    return {value: item, label: item};
  });
  rewriteList.value.unshift({label: '当前', value: 0});
})();

const rewriteSelectChange = async (val) => {
  if (val === 0) {
    formData.value.rewriteContent =  getRewrite();
  } else {
    formData.value.rewriteContent =  Website.getRewriteByRule(val);
  }
}

const save = async () => {
  try {
    Website.saveRewrite(serverName.value, formData.value.rewriteContent);
    message.info('保存成功');
  }catch (error){
    MessageBox.error(error.message ?? error, '保存出错！');
  }
}
</script>

<style scoped>

</style>