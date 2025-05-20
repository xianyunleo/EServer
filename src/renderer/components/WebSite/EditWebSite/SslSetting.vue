<template>
  <a-form
    :model='formData' ref="formRef" name='basic' autocomplete='off'
    :label-col='{ span: labelColSpan}' :wrapper-col='{ span: wrapperColSpan}'
  >
    <a-form-item :label="t('Port')" name='port'
                 :rules="[{  required: true, type: 'number', min: 1, max: 65535 }]">
      <a-input-number v-model:value='formData.port' min='1' max='65535' />
    </a-form-item>

    <a-form-item :label="mt('Certificate')" name='certPath'
                 :rules="[{ required: true, message:t('cannotBeEmpty') }]">
      <input-open-file-dialog v-model:value='formData.certPath' :toForwardSlash='true'></input-open-file-dialog>
    </a-form-item>

    <a-form-item label="Key" name="keyPath"
                 :rules="[{ required: true, message:t('cannotBeEmpty') }]">
      <input-open-file-dialog v-model:value='formData.keyPath' :toForwardSlash='true'></input-open-file-dialog>
    </a-form-item>

    <a-form-item :label="mt('Force', 'ws') + 'Https'" name="isForceHttps">
      <a-switch v-model:checked='formData.isForceHttps'  />
    </a-form-item>
  </a-form>

  <div style='display: flex;justify-content:space-evenly'>
    <a-button type='primary' @click='save'>{{t('Save')}}</a-button>
    <a-button type='primary' @click='close'>{{mt('Close','ws')+'SSL'}}</a-button>
  </div>
</template>

<script setup>
import { ref, inject, reactive, onMounted } from 'vue'
import Website from '@/main/services/website/Website'
import { message } from 'ant-design-vue'
import MessageBox from '@/renderer/utils/MessageBox'
import { mt, t } from '@/renderer/utils/i18n'
import { useMainStore } from '@/renderer/store'
import InputOpenFileDialog from '@/renderer/components/Input/InputOpenFileDialog.vue'

const { confName } = inject('WebsiteProvide')
const store = useMainStore()
const formRef = ref();
const emits = defineEmits(['editAfter'])
const labelColSpan = store.settings.Language === 'zh' ? 6 : 10;
const wrapperColSpan = store.settings.Language === 'zh' ? 18 : 14;

const initSslInfo = {
  port: 443,
  certPath: '',
  keyPath: '',
  isForceHttps: false
}

const formData = reactive({ ...initSslInfo })

onMounted(async () => {
  const sslInfo = await Website.getSslInfo(confName.value)
  Object.assign(formData, sslInfo)
  formData.port = formData.port ?? initSslInfo.port
})

const save = async () => {
  try {
    await formRef.value.validateFields()
  } catch (errorInfo) {
    console.log('Validate Failed:', errorInfo)
    return
  }
  try {
    await Website.setSSL(confName.value, formData)
    message.info(t('successfulOperation'))
    const sslInfo = await Website.getSslInfo(confName.value)
    Object.assign(formData, sslInfo)
  } catch (error) {
    MessageBox.error(error.message ?? error)
    return
  }

  emits('editAfter')
}

const close = async () => {
  try {
    await Website.closeSSL(confName.value)
    Object.assign(formData, initSslInfo)
    message.info(t('successfulOperation'))
  } catch (error) {
    MessageBox.error(error.message ?? error)
    return
  }

  emits('editAfter')
}
</script>

<style scoped>

</style>
