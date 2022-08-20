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
import SideBar from "@/components/SideBar";
import TitleBar from "@/components/TitleBar";
import App from "@/main/App";
import {ref} from "vue";
import MessageBox from "@/main/MessageBox";

let spinning = ref(false);

let initApp = async () => {
  if (!await App.initFileExists()) {
    return;
  }

  spinning.value = true;
  try {
    await App.init();
  } catch (e) {
    MessageBox.error(e.message);
  }
  spinning.value = false;
}

initApp();



</script>

<style>
</style>
