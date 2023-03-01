<template>
  <a-card title="其它" class="settings-card">
    <a-row type="flex" align="middle" class="settings-card-row">
      <a-col :span="24" style="display:flex;align-items: center">
        <span>文本编辑器：</span>
        <a-input v-model:value="textEditor" readonly style="flex: 1"></a-input>
        <a-button @click="clickTextEditor" style="margin-left: 5px">...</a-button>
      </a-col>
    </a-row>
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
</script>

<style scoped>

</style>