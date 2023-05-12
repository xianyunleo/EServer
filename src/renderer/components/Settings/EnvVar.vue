<template>
  <a-card title="环境变量" class="settings-card">
    <a-row type="flex" align="middle" class="settings-card-row">
      <a-col :span="24" class="flex-vertical-center">
        <a-switch v-model:checked="enableEnv" @change="changeEnableEnv" class="settings-switch" />
        <span>启用环境变量</span>
        <span style="margin-left: 20px;color: red">* 开关此项，需要重启终端后才能生效</span>
      </a-col>
    </a-row>
    <a-row type="flex" justify="space-around" align="middle" class="settings-card-row">
      <a-col :span="12" class="flex-vertical-center">
        <span :class="!enableEnv?'disabled-text':''">PHP-CLI版本：</span>
        <a-select style="width: 120px" :options="phpVersionList" :disabled="!enableEnv"
                  v-model:value="phpCliVersion" @change="phpCliVersionChange"/>
      </a-col>
      <a-col :span="12" class="flex-vertical-center">
        <a-switch v-model:checked="enableComposer" @change="changeEnableComposer" class="settings-switch"
                  :disabled="!enableEnv || phpCliVersion===''" />
          <span :class="!enableEnv?'disabled-text':''">启用Composer：</span>
      </a-col>
    </a-row>
  </a-card>
</template>

<script setup>
import {ref} from "vue";
import Settings from "@/main/Settings";
import Env from "@/main/core/Env/Env";
import {message} from "ant-design-vue";
import MessageBox from "@/renderer/utils/MessageBox";
import SoftwareExtend from "@/main/core/software/SoftwareExtend";
import GetPath from "@/shared/utils/GetPath";

const enableEnv = ref(Settings.get('EnableEnv'));

const changeEnableEnv = async () => {
  let val = enableEnv.value;
  const originVal = Settings.get('EnableEnv');
  try {
    await Env.switch(val);
    Settings.set('EnableEnv', val);
    message.warning('设置成功，未生效，请重启终端！')
  } catch (error) {
    MessageBox.error(error.message ?? error, '设置出错！');
    enableEnv.value = originVal;
  }
}

const PhpVersion = Settings.get('PhpVersion') ? Settings.get('PhpVersion') : '';
const phpCliVersion = ref(PhpVersion);
const phpVersionList = ref([]);
let list = SoftwareExtend.getPHPList();
phpVersionList.value = list.map(item => {
  return {value: item.version, label: item.name};
});
phpVersionList.value.push({value: '', label: '不设置'});

const phpCliVersionChange = () => {
  let val = phpCliVersion.value;
  const originVal = Settings.get('PhpVersion');
  try {
    if (val) {
      let path = GetPath.getPhpBinPath(val);
      Env.createBinFile(path, 'php')
    } else {
      Env.deleteBinFile('php')
    }
    Settings.set('PhpVersion', val);
    message.info('设置成功，已生效，不需要重启终端！')
  } catch (error) {
    MessageBox.error(error.message ?? error, '设置出错！');
    phpCliVersion.value = originVal;
  }
}

const enableComposer = ref(Settings.get('EnableComposer'));

const changeEnableComposer = async () => {
  let val = enableComposer.value;
  const originVal = Settings.get('EnableComposer');
  try {
    if (val) {
      let path = GetPath.getComposerBinPath();
      Env.createBinFile(path, 'composer')
    } else {
      Env.deleteBinFile('composer')
    }
    Settings.set('EnableComposer', val);
    message.info('设置成功，已生效，不需要重启终端！')
  } catch (error) {
    MessageBox.error(error.message ?? error, '设置出错！');
    enableComposer.value = originVal;
  }
}
</script>

<style scoped>

</style>