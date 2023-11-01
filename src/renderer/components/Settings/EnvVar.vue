<template>
  <a-card :title="t('EnvironmentVariables')" class="settings-card">
    <a-row type="flex" align="middle" class="settings-card-row">
      <a-col :span="24" class="flex-vertical-center">
        <a-switch v-model:checked="settingsReactive.EnableEnv" @change="changeEnableEnv" class="settings-switch" />
        <span>{{mt('Enable','ws','EnvironmentVariables')}}</span>
        <a-typography-text  style="margin-left: 20px" type="danger">* {{t('needRestartTerminal')}}
        </a-typography-text>
      </a-col>
    </a-row>
    <a-row type="flex" justify="space-around" align="middle" class="settings-card-row">
      <a-col :span="12" class="flex-vertical-center">
        <span :class="!settingsReactive.EnableEnv?'disabled-text':''">
          PHP-CLI {{t('Version')}}：
        </span>
        <a-select style="width: 120px" :options="phpVersionList" :disabled="!settingsReactive.EnableEnv"
                  v-model:value="settingsReactive.PhpCliVersion" @change="phpCliVersionChange"/>
      </a-col>
      <a-col :span="12" class="flex-vertical-center">
        <a-switch v-model:checked="settingsReactive.EnableComposer" @change="changeEnableComposer"
                  class="settings-switch"
                  :disabled="!settingsReactive.EnableEnv || settingsReactive.PhpCliVersion===''" />
          <span :class="!settingsReactive.EnableEnv?'disabled-text':''">{{t('Enable')}} Composer：</span>
      </a-col>
    </a-row>
  </a-card>
</template>

<script setup>
import {defineAsyncComponent, inject} from 'vue'
import Env from "@/main/core/Env/Env";
import {message} from "ant-design-vue";
import SoftwareExtend from "@/main/core/software/SoftwareExtend";
import GetPath from "@/shared/utils/GetPath";
import {mt,t}  from '@/shared/utils/i18n'

const props = defineProps({
  setFn: Function,
})

const { settingsReactive } = inject('GlobalProvide')
const setFn = (key, callback = null) => props.setFn(key, callback)
const ACard = defineAsyncComponent(() => {
  return new Promise((resolve) => {
    import('ant-design-vue').then((modules) => {
      resolve(modules.Card)
    })
  })
})
const changeEnableEnv = async () => {
  setFn('EnableEnv', async originVal => {
    await Env.switch(settingsReactive.EnableEnv)
  })
}

const phpVersionList = SoftwareExtend.getPHPList().map(item => {
  return { value: item.version, label: item.name }
})
phpVersionList.push({ value: '', label: t('NotSet') })

const phpCliVersionChange = () => {``
  setFn('PhpCliVersion', async originVal => {
    if (settingsReactive.PhpCliVersion) {
      let path = GetPath.getPhpExePath(settingsReactive.PhpCliVersion)
      Env.createBinFile(path, 'php')
    } else {
      Env.deleteBinFile('php')
    }
    message.success('设置成功，已生效，不需要重启终端！')
  })
}

const changeEnableComposer = async () => {
  setFn('EnableComposer', async originVal => {
    if (settingsReactive.EnableComposer) {
      let path = GetPath.getComposerExePath()
      Env.createBinFile(path, 'composer')
    } else {
      Env.deleteBinFile('composer')
    }
    message.success('设置成功，已生效，不需要重启终端！')
  })
}
</script>

<style scoped>

</style>
