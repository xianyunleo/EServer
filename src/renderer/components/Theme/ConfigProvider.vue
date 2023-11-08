<template>
  <a-config-provider :theme='customTheme'>
    <TokenProvider>
      <slot></slot>
    </TokenProvider>
  </a-config-provider>
</template>
<script setup>
import { theme } from 'ant-design-vue'
import TokenProvider from '@/renderer/components/Theme/TokenProvider.vue'
import { ref, inject } from 'vue'
import SystemTheme from '@/main/utils/SystemTheme'
import { electronRequire } from '@/main/utils/electron'

const nativeTheme = electronRequire('nativeTheme')
import { setTwoToneColor } from '@ant-design/icons-vue'

const { themeReactive ,settingsReactive} = inject('GlobalProvide')
themeReactive.changeThemeFn = changeTheme
const customTheme = ref()

async function changeTheme(modeStr, primaryColor) {
  const isDark = modeStr === 'dark' || (modeStr === 'system' && SystemTheme.isDarkModel())
  let customToken = {
    colorBgLayout: '#F5F7FA',
    colorPrimary: primaryColor,
    borderRadius: 5
  }

  let darkToken = {
    colorBgLayout: '#202020',
    colorBgContainer: '#303030',
    colorBorder: 'rgba(255, 255, 255, 0.15)',
    colorBorderSecondary: 'rgba(255, 255, 255, 0.06)',
    colorSplit: 'rgba(255, 255, 255, 0.06)',
    colorBgElevated: '#3F3F3F'
  }
  if (isDark) {
    customToken = { ...customToken, ...darkToken }
  }
  customTheme.value = {
    algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: customToken
  }

  setTwoToneColor(primaryColor)
}

changeTheme(settingsReactive.ThemeMode, settingsReactive.ThemeColor)

nativeTheme.on('updated', () => {
  if (settingsReactive.ThemeMode === 'system') {
    changeTheme(settingsReactive.ThemeMode, settingsReactive.ThemeColor)
  }
})
</script>

<style>

</style>
