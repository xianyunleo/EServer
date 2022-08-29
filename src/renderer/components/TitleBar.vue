<template>
  <div class="title-bar draggable">
    <div class="notify">
      通知：<a class="non-draggable" @click="clickUrl">测试中，请等待</a>
    </div>
  </div>
</template>

<script setup>


import Native from "@/renderer/utils/Native";

let clickUrl =  () => {
   Native.openUrl('http://www.phpenv.cn');
}
</script>

<style scoped lang="scss">
.notify {
  margin-left: 20px;
  font-size: 13px;

  a {
    color: rgba(0, 0, 0, 0.85);

    &:hover {
      color: #1890ff;
      cursor: pointer;
    }
  }
}
</style>
