<template>
  <div class="content-container">
    <a-row>
      <a-col :span="12" v-for="item in toolItems" :key="item.key">
        <div class="tool-item piece" @click="item.func">
          <div class="tool-item-avatar">
            <img :src="item.avatar" alt="icon">
          </div>
          <div class="tool-item-content">
            <h4 class="tool-item-title">{{ item.title }}</h4>
            <div class="tool-item-desc">{{ item.desc }}</div>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
  <mysql-reset-pwd-modal ref="mysqlResetPwdModalRef"></mysql-reset-pwd-modal>
</template>

<script setup>
import {ref} from "vue";
import {message} from 'ant-design-vue';
import MysqlResetPwdModal from "@/components/ToolPage/MysqlResetPwdModal"
import {openHosts} from "@/main/hosts";
import MessageBox from "@/main/MessageBox";
import {getMysqlIconPath} from "@/main/software";


let editHosts = async () => {
  message.info('打开中，请等待...');
  try {
    await openHosts();
  } catch (error) {
    MessageBox.error(error.message, '打开VS Code失败！');
  }
};


let mysqlResetPwdModalRef = ref(null);

let mysqlResetPwd = () => {
  mysqlResetPwdModalRef.value.visible = true;
}

  let toolItems = [
    {
      key: 'editHosts',
      avatar: 'https://joeschmoe.io/api/v1/random',
      title: '编辑hosts',
      desc: '查看、编辑hosts文件',
      func: editHosts,
    },
    {
      key: 'mysqlResetPwd',
      avatar: getMysqlIconPath(),
      title: 'MySQL修改密码',
      desc: '修改、重置MySQL的root账户的密码',
      func: mysqlResetPwd,
    },
  ];


</script>

<style scoped>
.tool-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
  padding: 12px 0;
  color: #000000d9;
  cursor: pointer;
}

.tool-item:hover {
  background: #fafafa;
}

.tool-item-avatar {
  margin-left: 16px;
  margin-right: 16px;
  display: flex;
}

.tool-item-avatar img {
  width: 50px;
  height: 50px;
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
