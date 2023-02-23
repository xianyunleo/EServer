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
    <user-pwd-modal v-model:show="userPwdModalShow" :cancel-is-exit="true" />
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

const userPwdModalShow = ref(false);

const spinning = ref(false);
provide('globalSpinning',spinning);

(async () => {
  if (!App.initFileExists() || App.isDev()) {
    return;
  }

  if (OS.isMacOS()) {
    if (!SettingsExtend.isUserPwdSet()) {
      userPwdModalShow.value = true;
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

</script>

<style>
</style>
