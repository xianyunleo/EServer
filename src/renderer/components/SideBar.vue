<template>
  <div class="sidebar">
    <div class="draggable"></div>
    <div class="logo-container">
      <img src="/img/icons/icon-trans.png" >
    </div>
    <a-menu mode="vertical" @select="menuItemSelect" v-model:selectedKeys="selectedKeys">
      <div style="flex: 1" class="non-draggable">
        <a-menu-item key="/">
          <template #icon><home-two-tone /> </template>{{$t("Home")}}
        </a-menu-item>
        <a-menu-item key="/website">
          <template #icon><layout-two-tone /> </template>{{$t("Website")}}
        </a-menu-item>
        <a-menu-item key="/tool">
          <template #icon><tool-two-tone /> </template>{{$t("Tools")}}
        </a-menu-item>
        <a-menu-item key="/software">
          <template #icon><appstore-two-tone /> </template>{{$t("AppStore")}}
        </a-menu-item>
      </div>
      <div style="margin-bottom: 25px;" class="non-draggable">
        <a-menu-item key="/settings">
          <template #icon><setting-two-tone  /> </template>{{$t("Settings")}}
        </a-menu-item>
        <a-menu-item key="/about">
          <template #icon><exclamation-circle-two-tone /> </template>{{$t("About")}}
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
import {defineAsyncComponent, inject, ref} from 'vue'
import {useRouter} from "vue-router";
const { globalReactive } = inject('GlobalProvide')
const router = useRouter();
const selectedKeys = ref(['/']);

const AMenu = defineAsyncComponent(() => {
  return new Promise((resolve) => {
    import('ant-design-vue').then((modules) => {
      resolve(modules.Menu)
    })
  })
})
const AMenuItem = defineAsyncComponent(() => {
  return new Promise((resolve) => {
    import('ant-design-vue').then((modules) => {
      resolve(modules.MenuItem)
    })
  })
})

const menuItemSelect = e =>{
  router.push({path:e.key})
}

</script>

<style scoped lang="less">

</style>
