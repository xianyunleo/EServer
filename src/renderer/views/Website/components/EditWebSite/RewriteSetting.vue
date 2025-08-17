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
      <a-textarea v-model:value="formData.rewriteContent" :auto-size="{ minRows: 10, maxRows:10}" />
    </a-form-item>
  </a-form>

  <div style="text-align: center">
    <a-button type="primary" @click="save">{{t('Save')}}</a-button>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'
import Website from "@/main/services/website/Website";
import MessageBox from "@/renderer/utils/MessageBox";
import {message} from "ant-design-vue";
import {  t } from '@/renderer/utils/i18n'
const { confName } = inject('WebsiteProvide')
const emits = defineEmits(['editAfter'])

const formData = ref({
  rewriteSelected: 0,
  rewriteContent: '',
});
const rewriteList = ref([]);

const getRewrite = async () => {
  return await Website.getRewrite(confName.value);
}

;(async () => {
  formData.value.rewriteContent = await getRewrite();
  let list = await Website.getRewriteRuleList();
  rewriteList.value = list.map(item => {
    return { value: item, label: item };
  });
  rewriteList.value.unshift({ label: t('Current'), value: 0 });
})();

const rewriteSelectChange = async (val) => {
  if (val === 0) {
    formData.value.rewriteContent = await getRewrite()
  } else {
    formData.value.rewriteContent = await Website.getRewriteByRule(val);
  }
}

const save = async () => {
  try {
    await Website.saveRewrite(confName.value, formData.value.rewriteContent);
    message.info(t('successfulOperation'))
  } catch (error) {
    MessageBox.error(error.message ?? error);
  }

  emits('editAfter');
}
</script>

<style scoped>

</style>
