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
    <a-button type="primary" @click="save">{{t('Save')}}</a-button>
  </div>
</template>

<script setup>
import {ref, inject, defineEmits} from "vue";
import Website from "@/main/core/website/Website";
import MessageBox from "@/renderer/utils/MessageBox";
import {message} from "ant-design-vue";
import {  t } from '@/shared/utils/i18n'
const { confName } = inject('WebsiteProvide')
const emits = defineEmits(['editAfter'])

const formData = ref({
  rewriteSelected: 0,
  rewriteContent: '',
});
const rewriteList = ref([]);

const getRewrite = () => {
  return Website.getRewrite(confName.value);
}

(() => {
  formData.value.rewriteContent = getRewrite();
  let list = Website.getRewriteRuleList();
  rewriteList.value = list.map(item => {
    return {value: item, label: item};
  });
  rewriteList.value.unshift({label: t('Current'), value: 0});
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
    Website.saveRewrite(confName.value, formData.value.rewriteContent);
    message.info('保存成功');
  }catch (error){
    MessageBox.error(error.message ?? error, '保存出错！');
  }

  emits('editAfter');
}
</script>

<style scoped>

</style>
