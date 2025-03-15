<template>
  <div class="sidebar">
    <div ref='logoContainer' class="draggable logo-container" @dblclick="dblclick">
      <img src="@/renderer/assets/img/icons/icon-trans.png" alt="icon" />
      <span class='color-text'>{{ APP_NAME }} </span>
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
        <a-menu-item key="/appStore">
          <template #icon><appstore-two-tone /> </template>{{$t("AppStore")}}
        </a-menu-item>
        <a-menu-item key="/customApp">
          <template #icon><appstore-two-tone /> </template>{{mt('Custom','ws','App')}}
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
import { APP_NAME } from '@/shared/utils/constant'
import {
  AppstoreTwoTone,
  ExclamationCircleTwoTone,
  HomeTwoTone,
  LayoutTwoTone,
  SettingTwoTone,
  ToolTwoTone
} from "@ant-design/icons-vue";
import { defineAsyncComponent, onMounted, ref } from 'vue'
import {useRouter} from "vue-router";
const call = Ipc.call
const router = useRouter();
const selectedKeys = ref(['/']);
import { isWindows ,isMacOS} from '@/main/utils/utils'
import { mt } from '../utils/i18n'
import Ipc from '@/renderer/utils/Ipc'

const dblclick = () => {
  if (!isWindows) call('switchMax')
}

const logoContainer = ref()
onMounted(() => {
  if (isMacOS) logoContainer.value.style.paddingTop = '50px'
})

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
