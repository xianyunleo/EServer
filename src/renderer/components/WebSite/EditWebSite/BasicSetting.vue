<template>
  <a-form
    :model='formData' ref="formRef" name='basic' autocomplete='off'
    :label-col='{ span: labelColSpan}' :wrapper-col='{ span: wrapperColSpan}'
  >
    <a-form-item :label="mt('Second','ws','DomainName')" name='extraServerName'>
      <a-input v-model:value='formData.extraServerName' @change='extraServerNameChange'
               :placeholder='t("defaultIsEmpty")' spellcheck='false' />
    </a-form-item>

    <a-form-item :label="t('Port')" name='port'
                 :rules="[{  required: true, type: 'number', min: 80, max: 65535 }]">
      <a-input-number v-model:value='formData.port' min='80' max='65535' disabled />
    </a-form-item>

    <a-form-item :label="t('RootPath')" name='rootPath' :rules='rootPathRules'>
      <input-open-dir-dialog v-model:value='formData.rootPath' :toForwardSlash='true'></input-open-dir-dialog>
    </a-form-item>

    <a-form-item :label="'PHP'+mt('ws','Version')" name='phpVersion'>
      <a-select style='width: 120px' v-model:value='formData.phpVersion' :options='phpVersionList'>
      </a-select>
    </a-form-item>

    <a-form-item :label="mt('Sync','ws')+'hosts'" name='syncHosts'>
      <a-switch v-model:checked='formData.syncHosts' :disabled='true' />
    </a-form-item>

    <a-form-item :label="mt('Note')" name='note'>
      <a-input v-model:value='formData.note' :maxlength='20'
               :placeholder='t("defaultIsEmpty")' spellcheck='false' />
    </a-form-item>
  </a-form>

  <div style='text-align: center'>
    <a-button type='primary' @click='save'>{{t('Save')}}</a-button>
  </div>
</template>

<script setup>
import { ref, inject, reactive } from 'vue'
import InputOpenDirDialog from '@/renderer/components/Input/InputOpenDirDialog.vue'
import Website from '@/main/core/website/Website'
import { message } from 'ant-design-vue'
import MessageBox from '@/renderer/utils/MessageBox'
import SoftwareExtend from '@/main/core/software/SoftwareExtend'
import Hosts from '@/main/utils/Hosts'
import { mt, t } from '@/shared/utils/i18n'
import { useMainStore } from '@/renderer/store'

const { confName, search } = inject('WebsiteProvide')
const store = useMainStore()
const formRef = ref();
const formData = reactive({})
const emits = defineEmits(['editAfter'])
const phpVersionList = ref([])
const labelColSpan = store.settings.Language === 'zh' ? 6 : 10;
const wrapperColSpan = store.settings.Language === 'zh' ? 18 : 14;

let websiteInfo
;(async () => {
  websiteInfo = await Website.getBasicInfo(confName.value)
  Object.assign(formData, websiteInfo)

  const list = await SoftwareExtend.getPHPList()
  phpVersionList.value = list.map(item => {
    return { value: item.version, label: item.name }
  })
  phpVersionList.value.push({ value: '', label: t('Static') })
})()

const save = async () => {
  try {
    await formRef.value.validateFields()
  } catch (errorInfo) {
    console.log('Validate Failed:', errorInfo)
    return
  }
  try {
    await Website.saveBasicInfo(confName.value, formData)
    message.info('保存成功')
    search()
  } catch (error) {
    MessageBox.error(error.message ?? error, '保存出错！')
    return
  }

  if (websiteInfo.syncHosts) {
    const oldExtSerName = websiteInfo.extraServerName
    const newExtSerName = formData.extraServerName
    syncHosts(oldExtSerName, newExtSerName)
  }

  websiteInfo = JSON.parse(JSON.stringify(formData))

  emits('editAfter', websiteInfo.phpVersion)
}

async function syncHosts(oldExtSerName, newExtSerName) {
  try {
    if (newExtSerName !== oldExtSerName) {
      //删除旧的第二域名对应的hosts文件配置
      if (oldExtSerName && !await Website.exists(oldExtSerName)) {
        await Hosts.delete(oldExtSerName)
      }
      //增加新的第二域名对应的hosts文件配置
      if (newExtSerName) {
        await Hosts.add(newExtSerName)
      }
    }
  } catch {
    /* empty */
  }
}

const extraServerNameChange = () => {
  formData.extraServerName = formData.extraServerName?.trim()
}

const rootPathRules = [
  {
    required: true,
    validator: async (_rule, value) => {
      if (value.includes(' ')) {
        return Promise.reject(t('pathCannotContainSpaces'))
      }
      return Promise.resolve()
    }
  }
]
</script>

<style scoped>

</style>
