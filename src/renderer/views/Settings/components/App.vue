<template>
  <a-card size="small" :title="t('Appearance')" class="settings-card">
    <a-row type="flex" align="middle" class="settings-card-row">
      <a-col :span="24" class="flex-vertical-center">
        <span> {{ t('Language') }}：</span>
        <a-select
          v-model:value="store.settings.Language"
          :options="languageOptions"
          @change="languageChange"
          placeholder="{{ t('pleaseChoose') }}"
          style="width: 200px"
        ></a-select>
      </a-col>
    </a-row>
    <a-row type="flex" align="middle" class="settings-card-row">
      <a-col :span="12" class="flex-vertical-center">
        <span>{{ mt('Theme', 'ws', 'Mode') }}：</span>
        <a-select
          v-model:value="store.settings.ThemeMode"
          :options="modeOptions"
          @change="themeModeChange"
          placeholder="{{ t('pleaseChoose') }}"
          style="width: 200px"
        ></a-select>
      </a-col>
      <a-col :span="12" class="flex-vertical-center">
        <span>{{ mt('Theme', 'ws', 'Color') }}：</span>
        <a-select
          v-model:value="store.settings.ThemeColor"
          :options="colorOptions"
          @change="themeColorChange"
          placeholder="{{ t('pleaseChoose') }}"
          style="width: 200px"
        ></a-select>
      </a-col>
    </a-row>
  </a-card>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { mt, t } from '@/renderer/utils/i18n'
import { createAsyncComponent } from '@/renderer/utils/utils'
import { useMainStore } from '@/renderer/store'
import { changeLanguageWrapper } from '@/renderer/utils/language'

const ACard = createAsyncComponent(import('ant-design-vue'), 'Card')
const { locale } = useI18n()
const store = useMainStore()

const languageOptions = [
  { label: '中文', value: 'zh' },
  { label: 'English', value: 'en' },
  { label: 'Français', value: 'fr' }
]

const modeOptions = computed(() => {
  return [
    { label: t('system'), value: 'system' },
    { label: t('light'), value: 'light' },
    { label: t('dark'), value: 'dark' }
  ]
})

const colorOptions = computed(() => {
  return [
    { label: t('blue'), value: '#1890FF' },
    { label: t('green'), value: '#00b96b' },
    { label: t('red'), value: '#DC4437' },
    { label: t('cyan'), value: '#02BCAA' },
    { label: t('pink'), value: '#fb7299' },
    { label: t('purple'), value: '#673BB7' }
  ]
})

const languageChange = () => {
  store.setSettings('Language', async (originVal) => {
    await changeLanguageWrapper(store.settings.Language)
  })
}

const themeModeChange = () => {
  store.setSettings('ThemeMode', async (originVal) => {
    store.changeTheme(store.settings.ThemeMode, store.settings.ThemeColor)
  })
}

const themeColorChange = () => {
  store.setSettings('ThemeColor', async (originVal) => {
    store.changeTheme(store.settings.ThemeMode, store.settings.ThemeColor)
  })
}
</script>

<style scoped></style>
