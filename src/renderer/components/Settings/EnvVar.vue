<template>
  <a-card size="small" :title="t('EnvironmentVariables')" class="settings-card">
    <a-row type="flex" align="middle" class="settings-card-row">
      <a-col :span="24" class="flex-vertical-center">
        <a-switch v-model:checked="store.settings.EnableEnv" @change="changeEnableEnv" class="settings-switch" />
        <span>{{ mt('Enable', 'ws', 'EnvironmentVariables') }}</span>
        <a-typography-text style="margin-left: 20px" type="danger">* {{ t('needRestartTerminal') }} </a-typography-text>
      </a-col>
    </a-row>
    <a-row type="flex" justify="space-around" align="middle" class="settings-card-row">
      <a-col :span="12" class="flex-vertical-center">
        <span :class="!store.settings.EnableEnv ? 'disabled-text' : ''"> PHP-CLI {{ t('Version') }}： </span>
        <a-select style="width: 120px" :options="phpVersionList" :disabled="!store.settings.EnableEnv" v-model:value="store.settings.PhpCliVersion" @change="phpCliVersionChange" />
      </a-col>
      <a-col :span="12" class="flex-vertical-center">
        <a-switch
          v-model:checked="store.settings.EnableComposer"
          @change="changeEnableComposer"
          class="settings-switch"
          :disabled="!store.settings.EnableEnv || store.settings.PhpCliVersion === ''"
        />
        <span :class="!store.settings.EnableEnv ? 'disabled-text' : ''">{{ t('Enable') }} Composer：</span>
      </a-col>
    </a-row>
  </a-card>
</template>

<script setup>
import { computed, ref } from 'vue'
import Env from '@/main/core/Env/Env'
import { message } from 'ant-design-vue'
import SoftwareExtend from '@/main/core/software/SoftwareExtend'
import GetDataPath from '@/shared/utils/GetDataPath'
import { mt, t } from '@/renderer/utils/i18n'
import { createAsyncComponent } from '@/renderer/utils/utils'
import { useMainStore } from '@/renderer/store'

const ACard = createAsyncComponent(import('ant-design-vue'), 'Card')
const store = useMainStore()

const changeEnableEnv = async () => {
  store.setSettings('EnableEnv', async (originVal) => {
    await Env.switch(store.settings.EnableEnv)
  })
}

const phpVersionListTemp = ref([])

const phpVersionList = computed(() => {
  return [...phpVersionListTemp.value, { value: '', label: mt('Not', 'ws', 'Set') }]
})

;(async () => {
  const list = await SoftwareExtend.getPHPList()
  phpVersionListTemp.value = list.map((item) => {
    return { value: item.version, label: item.name }
  })
})()

const phpCliVersionChange = () => {
  store.setSettings('PhpCliVersion', async (originVal) => {
    if (store.settings.PhpCliVersion) {
      let path = GetDataPath.getPhpExePath(store.settings.PhpCliVersion)
      await Env.createBinFile(path, 'php')
    } else {
      await Env.deleteBinFile('php')
    }
    message.success(t('The setting is successful and has taken effect. There is no need to restart the terminal!'))
  })
}

const changeEnableComposer = async () => {
  store.setSettings('EnableComposer', async (originVal) => {
    if (store.settings.EnableComposer) {
      let path = GetDataPath.getComposerExePath()
      await Env.createBinFile(path, 'composer')
    } else {
      await Env.deleteBinFile('composer')
    }
    message.success(t('The setting is successful and has taken effect. There is no need to restart the terminal!'))
  })
}
</script>

<style scoped></style>
