<template>
  <div class='title-bar draggable' @dblclick="dblclick">
    <div class='notify color-text'>
      {{ t('notice') }}：<a class='non-draggable color-text' @click='clickUrl'>🎉{{ t('none') }}</a>
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
import Native from '@/renderer/utils/Native'
import { t } from '@/renderer/utils/i18n'
import { isWindows } from '@/main/utils/utils'
import { OFFICIAL_URL } from '@/shared/utils/constant'
const call = window.api.call
const isWindowMax = ref(false)
const minimizeIsHover = ref(false)

const clickUrl = () => {
  Native.openUrl(OFFICIAL_URL)
}

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

window.api.onMainWindowMaximize(() => {
  isWindowMax.value = true
})

window.api.onMainWindowUnmaximize(() => {
  isWindowMax.value = false
})
</script>

<style scoped lang="less">
.notify {
  margin-left: 10px;
  font-size: 14px;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  a {
    &:hover {
      color: #1890ff;
      cursor: pointer;
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
