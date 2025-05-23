<template>
  <div class="content-container" style="padding: 0">
    <a-row>
      <a-col :span="12" v-for="item in toolItems" :key="item.key">
        <div class="tool-item piece piece-hover" @click="item.func">
          <div class="tool-item-avatar">
            <template v-if="item.iconType">
              <template v-if="item.iconType === iconTypes.textFile">
                <file-text-two-tone />
              </template>
              <template v-else-if="item.iconType === iconTypes.dir">
                <folder-open-two-tone />
              </template>
              <template v-else-if="item.iconType === iconTypes.list">
                <database-two-tone />
              </template>
            </template>
            <template v-else>
              <img :src="item.icon" alt="icon" />
            </template>
          </div>
          <div class="tool-item-content">
            <h4 class="tool-item-title">{{ item.title }}</h4>
            <div class="tool-item-desc">{{ item.desc }}</div>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
  <!--  v-if防止不显示就执行modal里面的代码-->
  <mysql-reset-pwd-modal v-if="mysqlResetPwdModalShow" v-model:show="mysqlResetPwdModalShow"> </mysql-reset-pwd-modal>
  <tcp-process-list-modal v-if="tcpProcessListModalShow" v-model:show="tcpProcessListModalShow"> </tcp-process-list-modal>
</template>

<script setup>
import { mt, t } from '@/renderer/utils/i18n'
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import { FileTextTwoTone, FolderOpenTwoTone, DatabaseTwoTone } from '@ant-design/icons-vue'
import MysqlResetPwdModal from '@/renderer/components/ToolPage/MysqlResetPwdModal.vue'
import GetCorePath from '@/shared/utils/GetCorePath'
import { sleep } from '@/shared/utils/utils'
import Opener from '@/renderer/utils/Opener'
import TcpProcessListModal from '@/renderer/components/ToolPage/TcpProcessListModal.vue'

const iconTypes = {
  dir: 'dir',
  file: 'file',
  list: 'list',
  textFile: 'textFile',
  tool: 'tool'
}

const toolItems = [
  {
    key: 'editHosts',
    iconType: iconTypes.textFile,
    title: `${mt('Edit', 'ws')}hosts`,
    desc: t('View and edit hosts file'),
    func: editHosts
  },
  {
    key: 'mysqlResetPwd',
    icon: GetCorePath.getMysqlIconPath(),
    title: t('mysqlResetRootAccountPwd'),
    desc: t('Modify or reset the password of the MySQL root account'),
    func: mysqlResetPwd
  },
  {
    key: 'tcpProcessList',
    iconType: iconTypes.list,
    title: `Tcp${mt('ws', 'Port', 'ws', 'Process', 'ws', 'List')}`,
    desc: t('Check port usage'),
    func: tcpProcessList
  }
]

async function editHosts() {
  message.info(t('pleaseWait'))
  await sleep(100)
  Opener.openHosts()
}

const mysqlResetPwdModalShow = ref(false)

function mysqlResetPwd() {
  mysqlResetPwdModalShow.value = true
}

const tcpProcessListModalShow = ref(false)

function tcpProcessList() {
  tcpProcessListModalShow.value = true
}
</script>

<style scoped lang="less">
@import '@/renderer/assets/css/var';

.tool-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 10px 10px 0 10px;
  padding: 12px 0;
  cursor: pointer;
}

.tool-item-avatar {
  margin-left: 16px;
  margin-right: 16px;
  display: flex;

  > img {
    width: 50px;
    height: 50px;
  }

  > span {
    font-size: 50px;
    width: 50px;
    height: 50px;
  }
}

.tool-item-content {
  flex: 1 0;
  width: 0;
  color: @colorText;
}

.tool-item-desc {
  font-size: 14px;
  color: @colorTextSecondary;
}
</style>
