<template>
  <a-modal
    width='580px'
    :title="mt('Modify','ws','Website')+`：${serverName}:${port}`"
    v-model:open='visible'
    :footer='null'
    class='left-tabs-modal'
    centered
    :maskClosable='false'>
    <div class='modal-content'>
      <a-tabs tabPosition='left' v-model:activeKey='activeKey' class='tabs'>
        <a-tab-pane key='basicSetting' :tab='t("Basic")'>
          <basic-setting @editAfter='editAfter' />
        </a-tab-pane>
        <a-tab-pane key='rewriteSetting' :tab='t("UrlRewrite")'>
          <rewrite-setting @editAfter='editAfter' />
        </a-tab-pane>
        <a-tab-pane key='sslSetting' tab='SSL'>
          <ssl-setting @editAfter='editAfter' />
        </a-tab-pane>
      </a-tabs>
    </div>
  </a-modal>
</template>

<script setup>
import { ref, inject } from 'vue'
import BasicSetting from '@/renderer/components/WebSite/EditWebSite/BasicSetting.vue'
import RewriteSetting from '@/renderer/components/WebSite/EditWebSite/RewriteSetting.vue'
import SslSetting from '@/renderer/components/WebSite/EditWebSite/SslSetting.vue'
import Settings from '@/main/Settings'
import { mt, t } from '@/renderer/utils/i18n'
import SoftwareExtend from '@/main/core/software/SoftwareExtend'

const { serverName, port, editModalVisible: visible } = inject('WebsiteProvide')
const defaultKey = 'basicSetting'
const activeKey = ref(defaultKey)
const { serverReactive } = inject('GlobalProvide')

const editAfter = (phpVersion = '') => {
  if (Settings.get('AutoStartAndRestartServer') && serverReactive.isRunningFn('Nginx')) {
    serverReactive.restartFn('Nginx')
    if (phpVersion) serverReactive.restartFn(SoftwareExtend.getPhpName(phpVersion))
  }
}
</script>

<style scoped lang='less'>
.modal-content {
  height: 380px;

  .tabs {
    height: 100%;
  }
}
</style>
