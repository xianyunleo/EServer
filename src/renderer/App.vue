<template>
  <a-spin :spinning="spinning"  tip="初始化中..." size="large" style="height: 100vh;">
    <a-row>
      <a-col :span="4" style="height: 100vh;">
        <SideBar />
      </a-col>
      <a-col :span="20" style="display: flex;flex-direction: column;height: 100vh">
        <TitleBar />
        <router-view />
      </a-col>
    </a-row>
    <!--  v-if防止不显示就执行modal里面的代码-->
    <user-pwd-modal v-if="userPwdModalShow" v-model:show="userPwdModalShow" :cancel-is-exit="true" />
  </a-spin>
</template>

<script setup>
import App from "@/main/App";
import {provide, ref} from "vue";
import SideBar from "@/renderer/components/SideBar";
import TitleBar from "@/renderer/components/TitleBar";
import MessageBox from "@/renderer/utils/MessageBox";
import UserPwdModal from "@/renderer/components/UserPwdModal.vue";
import OS from "@/main/core/OS";
import SettingsExtend from "@/main/core/SettingsExtend";
import Software from "@/main/core/software/Software";
import Service from "@/main/core/Service";
import {message} from "ant-design-vue";
import Directory from "@/main/utils/Directory";
import {MAC_USER_CORE_DIR} from "@/main/constant";

const userPwdModalShow = ref(false);

const spinning = ref(false);
provide('globalSpinning',spinning);

const nginxServerItem = ref();
provide('nginxServerItem',nginxServerItem);

const restartServerFunc = ref();
provide('restartServerFunc', restartServerFunc);

const startPhpFpmFunc = ref();
provide('startPhpFpmFunc', startPhpFpmFunc);

(async () => {
  try{
    Software.initList();
  }catch (error){
    await MessageBox.error(error.message ?? error, '软件出错！');
    App.exit();
  }

  if (OS.isWindows()) {
    stopWebService();
  }

  if (!App.initFileExists() || App.isDev()) {
    return;
  }

  if (OS.isMacOS()) {
    //判断设置的代码，electron-store会创建USER_CORE_DIR，为了捕捉创建失败的错误，先提前写好创建文件夹的代码。
    try {
      if (!Directory.Exists(MAC_USER_CORE_DIR)) {
        Directory.CreateDirectory(MAC_USER_CORE_DIR);
      }
    } catch (error) {
      MessageBox.error(error.message ?? error, '软件初始化出错！');
    }

    if (!SettingsExtend.isUserPwdSet()) {
      userPwdModalShow.value = true;
    } else {
      await update();
    }

  } else {
    try {
      spinning.value = true;
      await App.init();
      spinning.value = false;
    } catch (error) {
      MessageBox.error(error.message ?? error, '软件初始化出错！');
    }
  }

})()

async function update() {
  try {
    spinning.value = true;
    await App.update();
    spinning.value = false;
  } catch (error) {
    MessageBox.error(error.message ?? error, '软件升级出错！');
  }
}

async function stopWebService() {
  const IISServiceName = 'W3SVC';
  if (await Service.isRunning(IISServiceName)) {
    await Service.stop(IISServiceName);
    message.info('已自动停止IIS服务');
  }
}

</script>

<style>
</style>
