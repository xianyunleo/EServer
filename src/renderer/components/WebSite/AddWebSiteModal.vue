<template>
  <a-modal
    :title="mt('Add','ws','Website')"
    :ok-text="t('Submit')"
    :cancel-text="t('Cancel')"
    @ok='addWebClick'
    v-model:open='visible'
    centered
    :maskClosable='false'>
    <div class='modal-content'>
      <a-form
        ref='formRef' :model='formData' name='basic' autocomplete='off'
        :label-col='{ span: labelColSpan}' :wrapper-col='{ span: wrapperColSpan}'
      >
        <a-form-item :label="t('DomainName')+''" name='serverName'
                     :rules="[{ required: true, message: '请输入域名!' }]">
          <a-input v-model:value='formData.serverName' @change='serverNameChange' spellcheck='false' />
        </a-form-item>

        <a-form-item :label="t('Port')" name='port'
                     :rules="[{  required: true, type: 'number', min: 80, max: 65535 }]">
          <a-input-number v-model:value='formData.port' min='80' max='65535' />
        </a-form-item>

        <a-form-item :label="t('RootPath')" name='rootPath' :rules='rootPathRules'>
          <input-open-dir-dialog v-model:value='formData.rootPath' :toForwardSlash='true'></input-open-dir-dialog>
        </a-form-item>

        <a-form-item :label="'PHP'+mt('ws','Version')" name='phpVersion'>
          <a-select style='width: 120px' v-model:value='formData.phpVersion' :options='phpVersionList' />
        </a-form-item>

        <a-form-item :label="mt('Sync','ws')+'hosts'" name='syncHosts'>
          <a-switch v-model:checked='formData.syncHosts' />
        </a-form-item>
      </a-form>

    </div>
  </a-modal>
</template>

<script setup>
import { ref, reactive, inject } from 'vue'
import InputOpenDirDialog from '@/renderer/components/Input/InputOpenDirDialog.vue'
import path from 'path'
import Website from '@/main/core/website/Website'
import GetPath from '@/shared/utils/GetPath'
import MessageBox from '@/renderer/utils/MessageBox'
import SoftwareExtend from '@/main/core/software/SoftwareExtend'
import Hosts from '@/main/utils/Hosts'
import { replaceSlash } from '@/shared/utils/utils'
import Settings from '@/main/Settings'
import { mt, t } from '@/shared/utils/i18n'
const { settingsReactive } = inject('GlobalProvide')
const { search, addModalVisible: visible } = inject('WebsiteProvide')

const wwwPath = replaceSlash(GetPath.getWebsiteDir())
const formRef = ref()
const { serverReactive } = inject('GlobalProvide')

const formData = reactive({
  serverName: '',
  port: 80,
  rootPath: wwwPath,
  phpVersion: '',
  syncHosts: true
})

const labelColSpan = settingsReactive.Language === 'zh' ? 6 : 8;
const wrapperColSpan = settingsReactive.Language === 'zh' ? 18 : 16;

const phpVersionList = ref([])
let list = SoftwareExtend.getPHPList()
phpVersionList.value = list.map(item => {
  return { value: item.version, label: item.name }
})
phpVersionList.value.push({ value: '', label: t('Static') })

const serverNameChange = () => {
  formData.serverName = formData.serverName?.trim().replaceAll(/[^-a-zA-Z0-9.]/g, '')
  formData.rootPath = replaceSlash(path.join(wwwPath, formData.serverName))
}

const addWebClick = async () => {
  try {
    let values = await formRef.value.validateFields()
    visible.value = false
    formRef.value.resetFields()
    await addWeb(values)
    search()
  } catch (errorInfo) {
    console.log('Validate Failed:', errorInfo)
  }
}

const addWeb = async (websiteInfo) => {
  try {
    Website.add(websiteInfo)
  } catch (error) {
    MessageBox.error(error.message ?? error, '添加网站出错！')
    return
  }

  if (websiteInfo.syncHosts) {
    try {
      await Hosts.add(websiteInfo.serverName)
    } catch (error) {
      MessageBox.error(error.message ?? error,  t('errorOccurredDuring', [mt('sync', 'ws') + 'hosts']))
    }
  }

  if (serverReactive.nginxItem.isRunning && Settings.get('AutoStartAndRestartServer')) {
    serverReactive.restartFn(serverReactive.nginxItem)
    if (websiteInfo.phpVersion) {
      serverReactive.startPhpFpmFn(websiteInfo.phpVersion)
    }
  }
}

const rootPathRules = [
  {
    required: true,
    validator: async (_rule, value) => {
      if (value.includes(' ')) {
        return Promise.reject(t('directoryCannotContainSpaces'))
      }
      return Promise.resolve()
    }
  }
]
</script>

<style scoped>
.modal-content {
  padding: 0 5px;
}
</style>
