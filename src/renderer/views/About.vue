<template>
  <div class="content-container">
    <p style="text-align: center;font-size: 18px;margin-top: 50px">{{ APP_NAME }}集成服务环境</p>
    <p style="text-align: center">版本：{{version}}</p>
    <p style="text-align: center">
      官网：<a @click="openUrl('http://www.easysrv.cn')">www.easysrv.cn</a>
    </p>
    <p style="text-align: center">
      文档：<a @click="openUrl('http://www.easysrv.cn/doc')">www.easysrv.cn/doc</a>
    </p>
    <p style="text-align: center">
      Github：<a @click="openUrl('http://github.com/xianyunleo/EasySrv')">github.com/xianyunleo/EasySrv</a>
    </p>
  </div>
</template>

<script setup>
import App from "@/main/App";
import {APP_NAME} from "@/shared/constant";
import Native from "@/renderer/utils/Native";

const version = App.getVersion();

let openUrl = (url) => {
  Native.openUrl(url);
}
</script>

<style scoped>

</style>
