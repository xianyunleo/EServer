<template>
  <div class='title-bar draggable' @dblclick="dblclick">
    <div class='notice color-text'>
      <span class="notice-icon">📢</span>：
      <a class='non-draggable color-text' @click='clickUrl(store.noticeList?.[0]?.url)'>
        {{ store.noticeList?.[0]?.title }}</a>
    </div>
    <div class='window-controls-container non-draggable color-text' v-if='isWindows'>
      <div class='window-icon codicon codicon-chrome-minimize '
           :class="{'window-icon-hover': minimizeIsHover}"
           @click='minimizeClick'
           @mouseover='minimizeIsHover=true'
           @mouseout='minimizeIsHover=false'>
      </div>

      <div class='window-icon codicon window-icon-hover '
           :class="{
              'codicon-chrome-restore': isWindowMax,
              'codicon-chrome-maximize': !isWindowMax,
            }"
           @click='maximizeClick'>
      </div>

      <div class='window-icon window-icon-close codicon codicon-chrome-close ' @click='closeClick'>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Opener from '@/renderer/utils/Opener'
import { isWindows } from '@/main/utils/utils'
import { useMainStore } from '@/renderer/store'
import Ipc from '@/renderer/utils/Ipc'
const call = Ipc.call
const isWindowMax = ref(false)
const minimizeIsHover = ref(false)

const store = useMainStore()

const clickUrl = (url) => Opener.openUrl(url)

const minimizeClick = () => {
  call('windowMinimize')
  minimizeIsHover.value = false
}

const dblclick = () => {
  if (!isWindows) maximizeClick()
}

const maximizeClick = () => {
  call('windowSwitchMax')
}

const closeClick = () => {
  call('windowClose')
}

Ipc.on('mainWindowMaximize',() => {
  isWindowMax.value = true
})

Ipc.on('mainWindowUnmaximize',() => {
  isWindowMax.value = false
})
</script>

<style scoped lang="less">
.notice {
  display: flex;
  place-items: center;
  margin-left: 10px;
  font-size: 14px;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  .notice-icon {
    width: 24px;
    animation: textSizeChange 1s infinite;
    @keyframes textSizeChange {
      0% {
        font-size: 14px;
      }
      50% {
        font-size: 16px;
      }
      100% {
        font-size: 14px;
      }
    }
  }
}

.window-icon-background-gray {
  background-color: #ccc;
}

.window-icon-hover {
  &:hover {
    background-color: var(--colorBgTextHover);
  }
}

.window-icon-close {
  &:hover {
    background-color: rgba(232, 17, 35, 0.9);
  }
}

.window-controls-container {
  display: flex;
  width: 138px;
  height: 100%;
  --hover: green;
  --active: red;

  .window-icon {
    height: 100%;
    width: 46px;
    font-size: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
