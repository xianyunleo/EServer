<template>
  <a-modal
      :title="`修改网站[${props.serverName}]`"
      ok-text="确认"
      cancel-text="取消"
      v-model:visible="visible"
      :footer="null"
      class="left-tabs-modal"
      centered
      :maskClosable="false">
    <div class="modal-content">
      <a-tabs tabPosition="left" v-model:activeKey="activeKey">
        <a-tab-pane key="1" tab="基本配置">
          <basic-setting :confInfo="confInfo" />
        </a-tab-pane>
        <a-tab-pane key="2" tab="URL重写" >
          <rewrite-setting :confInfo="confInfo"  />
        </a-tab-pane>
      </a-tabs>
    </div>
  </a-modal>
</template>

<script setup>
// eslint-disable-next-line no-unused-vars
import {ref, defineExpose, defineProps, watch, reactive} from "vue";
import RewriteSetting from "@/components/WebSite/EditWebSite/RewriteSetting"
import BasicSetting from "@/components/WebSite/EditWebSite/BasicSetting";
import Website from "@/main/Website";

const props = defineProps({
  serverName: {type: String, required: true},
})

let activeKey = ref('1');
let confInfo = ref({});

watch(() => props.serverName, async (serverName) => {
  activeKey.value = '1';
  confInfo.value = await Website.getConf(serverName);
  console.log(confInfo.value)
})

let visible = ref(false);


defineExpose({visible});
</script>

<style scoped lang="scss">


//.modal-content .ant-row {
//  margin: 10px 0;
//}
//
//.modal-content .col-name {
//  line-height: 35px;
//  text-align: right;
//  padding-right: 10px;
//}
</style>