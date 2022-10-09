<template>
  <div class="sidebar">
    <div class="draggable"></div>
    <div class="logo-container">
      <img src="/img/icons/icon.png" >
    </div>
    <a-menu mode="vertical" @select="menuItemSelect" v-model:selectedKeys="selectedKeys">
      <div style="flex: 1" class="non-draggable">
        <a-menu-item key="/">
          <template #icon><home-two-tone /> </template> 首页
        </a-menu-item>
        <a-menu-item key="/website">
          <template #icon><layout-two-tone /> </template> 网站管理
        </a-menu-item>
        <a-menu-item key="/tool">
          <template #icon><tool-two-tone /> </template> 工具箱
        </a-menu-item>
        <a-menu-item key="/software">
          <template #icon><appstore-two-tone /> </template> 软件管理
        </a-menu-item>
      </div>
      <div style="margin-bottom: 25px;" class="non-draggable">
        <a-menu-item key="/settings">
          <template #icon><setting-two-tone  /> </template> 设置
        </a-menu-item>
        <a-menu-item key="/about">
          <template #icon><exclamation-circle-two-tone /> </template> 关于
        </a-menu-item>
      </div>
    </a-menu>
  </div>
</template>

<script setup>
import {
  AppstoreTwoTone,
  ExclamationCircleTwoTone,
  HomeTwoTone,
  LayoutTwoTone,
  SettingTwoTone,
  ToolTwoTone
} from "@ant-design/icons-vue";
import { ref } from 'vue';
import {useRouter} from "vue-router";

const router = useRouter();
const selectedKeys = ref(['/']);

const menuItemSelect = e =>{
  router.push({path:e.key})
}

</script>

<style scoped lang="scss">

</style>
