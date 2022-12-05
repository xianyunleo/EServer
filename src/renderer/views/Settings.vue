<template>
  <a-card title="其它" class="settings-card">
    <a-row type="flex"  align="middle" class="settings-card-row">
      <a-col :span="24" style="display:flex;align-items: center">
        <span>文本编辑器：</span>
        <a-input v-model:value="textEditor" style="flex: 1"></a-input>
        <a-button @click="clickTextEditor" style="margin-left: 5px">...</a-button>
      </a-col>
    </a-row>
  </a-card>
  <a-card title="环境变量" class="settings-card">
    <a-row type="flex"  align="middle" class="settings-card-row">
      <a-col :span="12">
        <span>启用环境变量：</span>
        <a-switch v-model:checked="enableEnv" @change="changeEnableEnv" />
      </a-col>
    </a-row>
    <a-row type="flex" justify="space-around" align="middle" class="settings-card-row">
      <a-col :span="12" style="display: flex;align-items: center">
        <span>PHP-CLI版本：</span>
        <a-select style="width: 120px" :options="phpVersionList" :disabled="!enableEnv"
                  v-model:value="phpCliVersion" @change="phpCliVersionChange" />
      </a-col>
      <a-col :span="12" style="display: flex;align-items: center">
        <span>启用Composer：</span>
        <a-switch v-model:checked="enableComposer" @change="changeEnableComposer"
                  :disabled="!enableEnv || phpCliVersion===''" />
      </a-col>
    </a-row>
  </a-card>
</template>

<script setup>
import {ref} from "vue";
import {message} from 'ant-design-vue';
import Env from "@/main/core/Env";
import MessageBox from "@/renderer/utils/MessageBox";
import SoftwareExtend from "@/main/core/software/SoftwareExtend";
import Settings from "@/main/Settings";
import GetPath from "@/shared/utils/GetPath";
import FileDialog from "@/renderer/utils/FileDialog";


const textEditor = ref(Settings.get('TextEditor'));

const clickTextEditor = async () => {
  let val = textEditor.value;
  let originVal = !val;
  try {
    let path = FileDialog.showOpenApp();
    if (path) {
      textEditor.value = path;
      Settings.set('TextEditor', path);
    }
  } catch (error) {
    MessageBox.error(error.message ?? error, '设置出错！');
    enableEnv.value = originVal;
  }
}

const enableEnv = ref(Settings.get('EnableEnv'));

const changeEnableEnv = async () => {
  let val = enableEnv.value;
  let originVal = !val;
  try {
    await Env.switch(val);
    Settings.set('EnableEnv', val);
    message.info('设置成功，已生效，不需要重启终端！')
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
  try {
    if (val) {
      let path = GetPath.getPhpBinPath(val);
      Env.createBinLink(path, 'php')
    } else {
      Env.deleteBinLink('php')
    }
    Settings.set('PhpVersion', val);
    message.info('设置成功，已生效，不需要重启终端！')
  } catch (error) {
    MessageBox.error(error.message ?? error, '设置出错！');
  }
}

const enableComposer = ref(Settings.get('EnableComposer'));

const changeEnableComposer = async () => {
  let val = enableComposer.value;
  let originVal = !val;
  try {
    if (val) {
      let path = GetPath.getComposerBinPath();
      Env.createBinLink(path, 'composer')
    } else {
      Env.deleteBinLink('composer')
    }
    Settings.set('EnableComposer', val);
    message.info('设置成功，已生效，不需要重启终端！')
  } catch (error) {
    MessageBox.error(error.message ?? error, '设置出错！');
    enableComposer.value = originVal;
  }
}


</script>

<style scoped lang="scss">
.settings-card {
  margin-top: 10px;
  .settings-card-row {
    margin-top: 20px;
  }
  .settings-card-row:first-child{
    margin-top: 00px;
  }
}



.settings-card-content {
  display: flex;
}
</style>
