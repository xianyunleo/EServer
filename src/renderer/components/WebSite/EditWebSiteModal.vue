<template>
  <a-modal
      width="550px"
      :title="`修改网站[${serverName}:${port}]`"
      ok-text="确定"
      cancel-text="取消"
      v-model:visible="visible"
      :footer="null"
      class="left-tabs-modal"
      centered
      :maskClosable="false">
    <div class="modal-content">
      <a-tabs tabPosition="left" v-model:activeKey="activeKey" class="tabs">
        <a-tab-pane key="basicSetting" tab="基本配置">
          <basic-setting/>
        </a-tab-pane>
        <a-tab-pane key="rewriteSetting" tab="URL重写">
          <rewrite-setting/>
        </a-tab-pane>
      </a-tabs>
    </div>
  </a-modal>
</template>

<script setup>
// eslint-disable-next-line no-unused-vars
import {ref, inject} from "vue";
import RewriteSetting from "@/renderer/components/WebSite/EditWebSite/RewriteSetting"
import BasicSetting from "@/renderer/components/WebSite/EditWebSite/BasicSetting";

const {serverName, port, editModalVisible: visible} = inject('website');
const defaultKey = 'basicSetting';
const activeKey = ref(defaultKey);

</script>

<style scoped lang="scss">
.modal-content{
  height: 350px;
  .tabs{
    height: 100%;
  }
}
</style>
