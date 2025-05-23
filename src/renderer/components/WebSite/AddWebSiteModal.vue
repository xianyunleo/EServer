<template>
  <a-modal :title="mt('Add', 'ws', 'Website')" :ok-text="t('Submit')" :cancel-text="t('Cancel')" @ok="addWebClick" v-model:open="visible" centered :maskClosable="false">
    <div class="modal-content">
      <a-form ref="formRef" :model="formData" name="basic" autocomplete="off" :label-col="{ span: labelColSpan }" :wrapper-col="{ span: wrapperColSpan }">
        <a-form-item :label="t('DomainName') + ''" name="serverName" :rules="[{ required: true, message: t('cannotBeEmpty') }]">
          <a-input v-model:value="formData.serverName" @change="serverNameChange" spellcheck="false" />
        </a-form-item>

        <a-form-item :label="t('Port')" name="port" :rules="[{ required: true, type: 'number', min: 80, max: 65535 }]">
          <a-input-number v-model:value="formData.port" min="80" max="65535" />
        </a-form-item>

        <a-form-item :label="t('RootPath')" name="rootPath" :rules="rootPathRules">
          <input-open-dir-dialog v-model:value="formData.rootPath" :toForwardSlash="true"></input-open-dir-dialog>
        </a-form-item>

        <a-form-item :label="'PHP' + mt('ws', 'Version')" name="phpVersion">
          <a-select style="width: 180px;" v-model:value="formData.phpVersion" :options="phpOpts"/>
          <a-tooltip title="Open the nginx php config directory">
            <span class='icon-wrapper' @click='openWebPhpConfigDir'><FolderOpenFilled class='icon' /></span>
          </a-tooltip>

        </a-form-item>

        <a-form-item :label="mt('Sync', 'ws') + 'hosts'" name="syncHosts">
          <a-switch v-model:checked="formData.syncHosts" />
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<script setup>
import { ref, reactive, inject } from 'vue'
import InputOpenDirDialog from '@/renderer/components/Input/InputOpenDirDialog.vue'
import path from 'path'
import Website from '@/main/services/website/Website'
import MessageBox from '@/renderer/utils/MessageBox'
import ChildAppExtend from '@/main/services/childApp/ChildAppExtend'
import Hosts from '@/main/utils/Hosts'
import Settings from '@/main/Settings'
import { mt, t } from '@/renderer/utils/i18n'
import { useMainStore } from '@/renderer/store'
import ServerService from '@/renderer/services/ServerService'
import { FolderOpenFilled } from '@ant-design/icons-vue'
import Opener from '@/renderer/utils/Opener'
import GetDataPath from '@/shared/utils/GetDataPath'
import WebsiteService from '@/renderer/services/WebsiteService'
const { search, addModalVisible: visible } = inject('WebsiteProvide')

const wwwPath = Settings.get('WebsiteDir')?.replaceSlash()
const formRef = ref()
const store = useMainStore()
const phpOpts = WebsiteService.getPhpOptions()
const formData = reactive({
  serverName: '',
  port: 80,
  rootPath: wwwPath,
  phpVersion: '',
  syncHosts: true
})

const labelColSpan = store.settings.Language === 'zh' ? 6 : 8
const wrapperColSpan = store.settings.Language === 'zh' ? 18 : 16

const serverNameChange = () => {
  formData.serverName = formData.serverName?.trim().replaceAll(/[^-a-zA-Z0-9.]/g, '')
  formData.rootPath = path.join(wwwPath, formData.serverName).replaceSlash()
}

const addWebClick = async () => {
  try {
    let values = await formRef.value.validate()
    await addWeb(values)
    search()
  } catch (errorInfo) {
    console.log('Validate Failed:', errorInfo)
  }
}

const addWeb = async (websiteInfo) => {
  const { serverName, phpVersion, syncHosts } = websiteInfo
  try {
    if(websiteInfo.phpVersion) await WebsiteService.checkCustomPhpConf(formData.phpVersion, phpOpts)
    await Website.add(websiteInfo)
  } catch (error) {
    MessageBox.error(error.message ?? error, t('Error adding website!'))
    return
  }
  visible.value = false
  formRef.value.resetFields()
  if (syncHosts) {
    try {
      await Hosts.add(serverName)
    } catch (error) {
      MessageBox.error(error.message ?? error, t('errorOccurredDuring', [mt('sync', 'ws') + 'hosts']))
    }
  }

  if (Settings.get('AutoStartAndRestartServer') && ServerService.isRunning('Nginx')) {
    ServerService.restart('Nginx')
    if (phpVersion) {
      const option = phpOpts.find(item => item.value === phpVersion)
      const phpName = option.isCustom ? option.label : ChildAppExtend.getPhpName(phpVersion)
      ServerService.restart(phpName)
    }
  }
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

const openWebPhpConfigDir = () => Opener.openDirectory(GetDataPath.getNginxPhpConfDir())
</script>

<style scoped>
.modal-content {
  padding: 0 5px;
}
</style>
