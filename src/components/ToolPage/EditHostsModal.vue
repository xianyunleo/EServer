<template>
    <a-modal
        title="编辑hosts"
        ok-text="确认"
        cancel-text="取消"
        @ok="save"
        v-model:visible="visible"
        centered
        width="90%"
        wrap-class-name="hosts-modal"
        :maskClosable="false"
    >

        <v-ace-editor
            v-model:value="content"
            lang="text"
            theme="chrome"
            :options="options"
            class="editor" />

    </a-modal>
</template>

<script setup >
import { VAceEditor } from 'vue3-ace-editor';
import 'ace-builds/src-noconflict/mode-text';
import 'ace-builds/src-noconflict/theme-chrome';

import {ref,defineExpose} from "vue";
import {getHostsContent} from "@/main/hosts";


let visible = ref(false);
let content = ref('');
let options = ref({
  fontSize: "14px",
  showPrintMargin: false
});



(async () => {
  content.value = await getHostsContent();
})();

let save = async()=>{
  // try {
  //   setHostsContent(content)
  // } catch (e) {
  //
  // }
}

defineExpose({visible});
</script>

<style lang="less">
.hosts-modal {
  -webkit-app-region: no-drag;
  .ant-modal {
    max-width: 100%;
    top: 0;
    padding-bottom: 0;
    margin: 0;
  }
  .ant-modal-content {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 70px);
  }
  .ant-modal-body {
    padding: 0;
    flex: 1;
  }

}
.editor{
  height: 100%;
}
</style>