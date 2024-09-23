<template>
  <a-modal
      :title="t('mysqlResetRootAccountPwd')"
      :ok-text="t('Submit')"
      :cancel-text="t('Cancel')"
      :ok-button-props="{loading:okButtonLoading}"
      @ok="resetClick"
      v-model:open="visible"
      centered
      :maskClosable="false">
    <div class="modal-content">
      <div style="text-align: center;padding-bottom: 20px">{{t('mysqlResetPwdTip')}}</div>
      <a-form
          :model="formData"
          ref="formRef"
          :label-col="{ span: 8}"
          :wrapper-col="{ span: 16 }"
          autocomplete="off">
        <a-form-item :label="`MySQL ${mt('Version')}`" name="version"
                     :rules="[{ required: true, message: mt('Please','ws','Select')}]">
          <a-select style="width: 150px" v-model:value="formData.version" :options="mysqlVersionList">
          </a-select>
        </a-form-item>
        <a-form-item :label="mt('New','ws','Pwd')"  name="newPwd"
                     :rules="[{ required: true, message: '请输入新密码!' }]">
          <a-input v-model:value="formData.newPwd"/>
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<script setup>
import {ref,computed} from "vue";
import SoftwareExtend from "@/main/core/software/SoftwareExtend";
import Database from "@/main/core/Database";
import MessageBox from "@/renderer/utils/MessageBox";
import { t,mt } from '@/renderer/utils/i18n'
import { message } from 'ant-design-vue'

const props = defineProps({ show: Boolean })
const emit = defineEmits(['update:show'])

const visible = computed({
  get() {
    return props.show;
  },
  set(value) {
    emit('update:show', value);
  }
})
const formRef = ref()
const formData = ref({})
const mysqlVersionList = ref([])
const okButtonLoading = ref(false)

;(async () => {
  const list = await SoftwareExtend.getMySQLList()
  mysqlVersionList.value = list.map(item => {
    return { value: item.version, label: item.name }
  })
})()

const resetClick = async () => {
  try {
    let values = await formRef.value.validateFields();
    await reset(values.version, values.newPwd);
  } catch (errorInfo) {
    console.log('Validate Failed:', errorInfo);
  }
};
const reset = async (version, newPwd) => {
  try {
    okButtonLoading.value = true
    await Database.resetMySQLPassword(version, newPwd)
    message.success(t('successfulOperation'))
  } catch (error) {
    MessageBox.error(error.message ?? error, t('errorOccurredDuring', [t('operation')]))
  } finally {
    okButtonLoading.value = false
  }
}

</script>

<style scoped>

</style>
