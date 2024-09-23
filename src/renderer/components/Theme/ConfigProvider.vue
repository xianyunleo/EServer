<template>
  <a-config-provider :theme='store.customTheme'>
    <TokenProvider>
      <slot></slot>
    </TokenProvider>
  </a-config-provider>
</template>
<script setup>

import TokenProvider from '@/renderer/components/Theme/TokenProvider.vue'
import { useMainStore } from '@/renderer/store'
const store = useMainStore()

window.matchMedia('(prefers-color-scheme: dark)').onchange = () => {
  if (store.settings.ThemeMode === 'system') {
    store.changeTheme(store.settings.ThemeMode, store.settings.ThemeColor)
  }
}
</script>

<style>

</style>
