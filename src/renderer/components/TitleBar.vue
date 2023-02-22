<template>
  <div class="title-bar draggable">
    <div class="notify">
      通知：<a class="non-draggable" @click="clickUrl">暂无</a>
    </div>
    <div class="window-controls-container non-draggable" v-if="isWindows">
      <div class="window-icon codicon codicon-chrome-minimize"
           :class="{'window-icon-background-gray': minimizeIsHover}"
           @click="minimizeClick"
           @mouseover="minimizeIsHover=true"
           @mouseout="minimizeIsHover=false">
      </div>

      <div class="window-icon codicon window-icon-hover"
           :class="{
              'codicon-chrome-restore': isWindowMax,
              'codicon-chrome-maximize': !isWindowMax,
            }"
           @click="maximizeClick">
      </div>

      <div class="window-icon window-icon-close codicon codicon-chrome-close"
           :class="{'window-icon-close-hover': closeIsHover}"
           @click="closeClick"
           @mouseover="closeIsHover=true"
           @mouseout="closeIsHover=false">
      </div>
    </div>
  </div>

</template>

<script setup>

import Native from "@/renderer/utils/Native";
import {ref} from "vue";
import OS from "@/main/core/OS";
import {BrowserWindow} from '@electron/remote';

let clickUrl =  () => {
   Native.openUrl('http://www.easysrv.cn');
}

const isWindows = ref(OS.isWindows());
const isWindowMax = ref(false);
const mainWindow= BrowserWindow.getAllWindows()[0];
const minimizeIsHover = ref(false);
const closeIsHover = ref(false);

const minimizeClick = () => {
  mainWindow.minimize();
  minimizeIsHover.value = false;
}

const maximizeClick = () => {
  if(mainWindow.isMaximized()){
    mainWindow.unmaximize();
  }else{
    mainWindow.maximize();
  }
}

const closeClick = ()=>{
  mainWindow.close();
  closeIsHover.value = false;
}

mainWindow.on('maximize',()=>{
  console.log('maximize on')
  isWindowMax.value = true;
})

mainWindow.on('unmaximize',()=>{
  console.log('unmaximize on')
  isWindowMax.value = false;
})


</script>

<style scoped lang="scss">
@import "@/renderer/assets/css/var.scss";
.notify {
  margin-left: 20px;
  font-size: 13px;
  flex: 1;

  a {
    color: rgba(0, 0, 0, 0.85);

    &:hover {
      color: #1890ff;
      cursor: pointer;
    }
  }
}

.window-icon-background-gray{
  background-color:#ccc;
}

.window-icon-hover{
  &:hover {
    background-color:#ccc;
  }
}

.window-icon-close-hover{
  background-color:rgba(232,17,35,.9);
}

.window-controls-container{
  display: flex;
  width:138px;
  height: 100%;
  --hover: green;
  --active: red;
  .window-icon{
    height: 100%;
    width: 46px;
    font-size: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}



</style>
