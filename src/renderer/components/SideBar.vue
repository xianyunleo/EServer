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
        <a-menu-item key="/setting">
          <template #icon><setting-two-tone  /> </template> 设置
        </a-menu-item>
        <a-menu-item key="/about">
          <template #icon><exclamation-circle-two-tone /> </template> 关于
        </a-menu-item>
      </div>
    </a-menu>
  </div>
  <a-modal v-model:visible="aboutVisible" title="关于" >
    <template #footer>
      <a-button type="primary" @click="handleOk">确认</a-button>
    </template>
    <p style="text-align: center;font-size: 18px;">{{ APP_NAME }}集成环境</p>
    <p style="text-align: center">版本：{{version}} 测试版</p>
    <p style="text-align: center">官网：www.easysrv.cn</p>
    <p style="text-align: center">Github：github.com/xianyunleo/EasySrv</p>
  </a-modal>
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
import {APP_NAME} from "@/shared/constant";
import App from "@/main/App";

const router = useRouter();
const selectedKeys = ref(['/']);
const aboutVisible = ref(false);
const version = App.getVersion();
const menuItemSelect = e =>{
  let path =  e.key
  if(path ==='/about'){
    aboutVisible.value = true;
  }else{
    router.push({path:e.key})
  }

}
const handleOk = () =>{
  aboutVisible.value = false;
}
</script>

<style scoped lang="scss">

</style>