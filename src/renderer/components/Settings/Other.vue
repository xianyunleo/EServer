<template>
  <a-card title="其它" class="settings-card">
    <a-row type="flex" align="middle" class="settings-card-row">
      <a-col :span="24" class="flex-vertical-center">
        <span>文本编辑器：</span>
        <a-input v-model:value="textEditor" readonly style="flex: 1"></a-input>
        <a-button @click="clickTextEditor" style="margin-left: 5px">...</a-button>
      </a-col>
    </a-row>

    <div class="settings-card-row flex-vertical-center">
      <a-switch v-model:checked="autoRestartWebServer" @change="changeAutoRestartWebServer" class="settings-switch"/>
      <span >新增、修改网站后重启Web服务</span>
    </div>

    <div class="settings-card-row flex-vertical-center">
        <a-switch v-model:checked="autoStartPhpFpm" @change="changeAutoStartPhpFpm" class="settings-switch"  />
      <span>新增、修改网站后启动对应的PHP-FPM</span>
    </div>
  </a-card>
</template>

<script setup>
import FileDialog from "@/renderer/utils/FileDialog";
import Settings from "@/main/Settings";
import MessageBox from "@/renderer/utils/MessageBox";
import {ref} from "vue";

const textEditor = ref(Settings.get('TextEditor'));

const clickTextEditor = async () => {
  const originVal = Settings.get('TextEditor');
  try {
    let path = FileDialog.showOpenApp();
    if (path) {
      textEditor.value = path;
      Settings.set('TextEditor', path);
    }
  } catch (error) {
    MessageBox.error(error.message ?? error, '设置出错！');
    textEditor.value = originVal;
  }
}

const autoRestartWebServer = ref(Settings.get('autoRestartWebServer'));

const changeAutoRestartWebServer = async () => {
    const originVal = Settings.get('autoRestartWebServer');
    try {
        Settings.set('autoRestartWebServer', autoRestartWebServer.value);
    } catch (error) {
        MessageBox.error(error.message ?? error, '设置出错！');
        autoRestartWebServer.value = originVal;
    }
}

const autoStartPhpFpm = ref(Settings.get('autoStartPhpFpm'));

const changeAutoStartPhpFpm = async () => {
    const originVal = Settings.get('autoStartPhpFpm');
    try {
        Settings.set('autoStartPhpFpm', autoStartPhpFpm.value);
    } catch (error) {
        MessageBox.error(error.message ?? error, '设置出错！');
        autoStartPhpFpm.value = originVal;
    }
}

</script>

<style scoped>

</style>