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
          <basic-setting />
        </a-tab-pane>
        <a-tab-pane key="2" tab="URL重写" >
          <rewrite-setting />
        </a-tab-pane>
      </a-tabs>
    </div>
  </a-modal>
</template>

<script setup>
// eslint-disable-next-line no-unused-vars
import {ref, defineExpose, defineProps, watch, reactive,onUpdated,} from "vue";
import RewriteSetting from "@/components/WebSite/EditWebSite/RewriteSetting"
import BasicSetting from "@/components/WebSite/EditWebSite/BasicSetting";
// eslint-disable-next-line no-unused-vars
import Website from "@/main/Website";

const props = defineProps({
  serverName: {type: String, required: true},
})

let visible = ref(false);

let activeKey = ref('1');
let confInfo = ref({});


onUpdated(async () => {
  if (visible.value) {
    activeKey.value = '1';
    confInfo.value = await Website.getInfo(props.serverName);
    console.log('confInfo', confInfo.value)
  }
})

defineExpose({visible});
</script>

<style scoped lang="scss">
.left-tabs-modal {
/*  todo不生效*/
  :deep(.ant-modal-content){
    height: 600px!important;
  }
}

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