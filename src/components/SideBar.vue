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
  <a-modal v-model:visible="visible" title="EasyEnv" @ok="handleOk">
    <p>开发中</p>
    <p>给我赞助点</p>
    <p>Some contents...</p>
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

const router = useRouter();
const selectedKeys = ref(['/']);
const visible = ref(false);
const menuItemSelect = e =>{
  let path =  e.key

  if(path =='/about'){
    visible.value = true;
  }else{
    router.push({path:e.key})
  }
}
const handleOk = () =>{
  visible.value = false;
}
</script>

<style scoped lang="scss">

</style>