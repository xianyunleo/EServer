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
  </a-spin>
</template>

<script setup>
import App from "@/main/App";
import {ref} from "vue";
import SideBar from "@/renderer/components/SideBar";
import TitleBar from "@/renderer/components/TitleBar";
import MessageBox from "@/renderer/utils/MessageBox";

const spinning = ref(false);

(async () => {
  if (!App.initFileExists()) {
    return;
  }
  spinning.value = true;
  try {
    await App.init();
  } catch (error) {
    MessageBox.error(error.message ?? error, '软件初始化出错！');
  }
  spinning.value = false;
})()

</script>

<style>
</style>
