<template>
  <a-row style="height: 100%;">
    <a-col :span="4" style="height: 100%;">
      <SideBar />
    </a-col>
    <a-col :span="20" style="display: flex;flex-direction: column;height: 100%">
      <TitleBar />
      <router-view />
    </a-col>
  </a-row>
</template>

<script>

import SideBar from "@/components/SideBar";
import TitleBar from "@/components/TitleBar";
export default {
  name: 'App',
  components: {
    TitleBar,
    SideBar,

  }
}
</script>

<style>
</style>
