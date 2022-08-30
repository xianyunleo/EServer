<template>
  <div class="content-container">
    <a-row>
      <a-col :span="12" v-for="item in toolItems" :key="item.key">
        <div class="tool-item piece" @click="item.func">
          <div class="tool-item-avatar">
            <template v-if="item.iconType">
              <template v-if="item.iconType === iconTypes.textFile">
                <file-text-two-tone />
              </template>
              <div v-else-if="item.iconType === iconTypes.dir">
                <folder-open-two-tone />
              </div>
            </template>
            <template v-else>
              <img :src="item.icon" alt="icon">
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
  <mysql-reset-pwd-modal v-model:show="mysqlResetPwdModalShow"></mysql-reset-pwd-modal>
</template>

<script setup>
import {ref} from "vue";
import {message} from 'ant-design-vue';

import {FileTextTwoTone,FolderOpenTwoTone} from "@ant-design/icons-vue";
import MysqlResetPwdModal from "@/renderer/components/ToolPage/MysqlResetPwdModal"
import MessageBox from "@/renderer/utils/MessageBox";
import GetPath from "@/shared/utils/GetPath";
import {sleep} from "@/shared/utils/utils";
import Native from "@/renderer/utils/Native";


const iconTypes = {
  dir: 'dir',
  file: 'file',
  textFile: 'textFile',
  tool: 'tool',
}

const editHosts = async () => {
  message.info('打开中，请等待...');
  await sleep(100);
  try {
    await Native.openHosts();
  } catch (error) {
    MessageBox.error(error.message ? error.message : error, '打开hosts文件出错！');
  }
};

const mysqlResetPwdModalShow = ref(false);

const mysqlResetPwd = () => {
  mysqlResetPwdModalShow.value = true;
}

const toolItems = [
  {
    key: 'editHosts',
    iconType: iconTypes.textFile,
    title: '编辑hosts',
    desc: '查看、编辑hosts文件',
    func: editHosts,
  },
  {
    key: 'mysqlResetPwd',
    icon: GetPath.getMysqlIconPath(),
    title: 'MySQL重置密码',
    desc: '修改、重置MySQL的root账户的密码',
    func: mysqlResetPwd,
  },
];


</script>

<style scoped lang="scss">
.tool-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
  padding: 12px 0;
  color: #000000d9;
  cursor: pointer;
  &:hover {
    background: #fafafa;
  }
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
  color: #000000d9;
}

.tool-item-desc {
  font-size: 14px;
  color: #00000073;
}
</style>
