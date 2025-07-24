<template>
  <slot></slot>
</template>

<script setup>
import { watch } from 'vue'
import { useStyleTag } from '@vueuse/core'
import { theme } from 'ant-design-vue'

const { token } = theme.useToken()
const {css} = useStyleTag('')

watch(token, token => {
  css.value = generateThemeVariables(token)
},{ immediate: true })

/**
 * 生成主题var
 */
function generateThemeVariables(token) {
  const cssVar = Object.entries(token)
    .filter(([key]) => /^(control|height|color|font|line|link|motion|border|margin|padding(?!con)|screen((?!min|max).)*$|boxShadow(?!pop|dra|tab|car))/i.test(key))
    .map(([key, value]) => `--${key}: ${value}${/(size|width|radius|margin|screen|padding)/ig.test(key) ? 'px' : ''}`)

  return `
    :root {
      ${cssVar.join(';\n')}
    }
  `.trim()
}

function setRootStyle(key, val) {
  document.querySelector(':root').style.setProperty(key, val)
}
</script>

<style scoped>
</style>
