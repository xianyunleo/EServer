<template>
  <a-modal
      :title="modalTitle"
      ok-text="确认"
      cancel-text="取消"
      v-model:visible="visible"
      :footer="null"
      class="tabs-modal"
      :maskClosable="false">
    <div class="modal-content">
      <a-tabs>
        <a-tab-pane key="1" tab="基本配置">
          <base-setting />
        </a-tab-pane>
        <a-tab-pane key="2" tab="URL重写" >
          <rewrite-setting/>
        </a-tab-pane>
      </a-tabs>
    </div>
  </a-modal>
</template>

<script setup>
import {defineExpose,ref} from "vue";
import BaseSetting from "@/components/WebSite/EditWebSite/BaseSetting"
import RewriteSetting from "@/components/WebSite/EditWebSite/RewriteSetting"

let visible = ref(false);

let serverName = 'www.baidu.com'
let modalTitle = `修改网站[${serverName}]`

defineExpose({visible});
</script>

<style scoped>
.modal-content {
  padding: 0 10px;
}

.modal-content .ant-row {
  margin: 10px 0;
}

.modal-content .col-name {
  line-height: 35px;
  text-align: right;
  padding-right: 10px;
}
</style>