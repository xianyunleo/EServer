<template>
  <a-modal title="修改网站" ok-text="确认" cancel-text="取消" @ok="addWeb" :maskClosable="false">
    <div class="modal-content">
      <a-tabs>
        <a-tab-pane key="1" tab="Tab 1">Content of Tab Pane 1</a-tab-pane>
        <a-tab-pane key="2" tab="Tab 2" force-render>Content of Tab Pane 2</a-tab-pane>
        <a-tab-pane key="3" tab="Tab 3">Content of Tab Pane 3</a-tab-pane>
      </a-tabs>
    </div>
  </a-modal>
</template>

<script>
import {defineComponent} from "vue";

export default defineComponent({
  name: "EditWebSiteModal"
})


</script>

<style scoped>
.modal-content {
  padding: 0 50px;
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