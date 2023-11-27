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
      </a-tabs>
    </div>
  </a-modal>
</template>

<script setup>
import { ref, inject } from 'vue'
import RewriteSetting from '@/renderer/components/WebSite/EditWebSite/RewriteSetting.vue'
import BasicSetting from '@/renderer/components/WebSite/EditWebSite/BasicSetting.vue'
import Settings from '@/main/Settings'
import { mt, t } from '@/shared/utils/i18n'
import { useMainStore } from '@/renderer/store'

const { serverName, port, editModalVisible: visible } = inject('WebsiteProvide')
const defaultKey = 'basicSetting'
const activeKey = ref(defaultKey)
const { serverReactive } = inject('GlobalProvide')
const store = useMainStore()

const editAfter = (phpVersion = '') => {
  if (store.nginxServer.isRunning && Settings.get('AutoStartAndRestartServer')) {
    serverReactive.restartFn(store.nginxServer)
    if (phpVersion) {
      serverReactive.startPhpFpmFn(phpVersion)
    }
  }
}

</script>

<style scoped lang='less'>
.modal-content {
  height: 350px;

  .tabs {
    height: 100%;
  }
}
</style>
