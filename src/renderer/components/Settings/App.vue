<template>
  <a-card size="small" :title='t("Application")' class='settings-card'>
    <a-row type='flex' align='middle' class='settings-card-row'>
      <a-col :span='24' class='flex-vertical-center'>
        <span> {{ t('Language') }}：</span>
        <a-select
          v-model:value='settingsReactive.Language'
          :options='languageOptions' @change='languageChange'
          placeholder='请选择' style='width: 200px'
        ></a-select>
      </a-col>
    </a-row>
    <a-row type='flex' align='middle' class='settings-card-row'>
      <a-col :span='12' class='flex-vertical-center'>
        <span>{{ mt('Theme','ws','Mode') }}：</span>
        <a-select
          v-model:value='settingsReactive.ThemeMode'
          :options='modeOptions' @change='themeModeChange'
          placeholder='请选择' style='width: 200px'
        ></a-select>
      </a-col>
      <a-col :span='12' class='flex-vertical-center'>
        <span>{{ mt('Theme','ws','Color') }}：</span>
        <a-select
          v-model:value='settingsReactive.ThemeColor'
          :options='colorOptions' @change='themeColorChange'
          placeholder='请选择' style='width: 200px'
        ></a-select>
      </a-col>
    </a-row>
  </a-card>
</template>

<script setup>
import {computed, inject} from 'vue'
import { useI18n } from 'vue-i18n'
import {mt,t}  from '@/shared/utils/i18n'
import TrayManage from '@/main/TrayManage'
import { createAsyncComponent } from '@/renderer/utils/utils'

const ACard = createAsyncComponent(import('ant-design-vue'), 'Card')
const { themeReactive, settingsReactive } = inject('GlobalProvide')
const { locale } = useI18n()
const props = defineProps({
  setFn: Function
})
const setFn = (key, callback = null) => props.setFn(key, callback)

const languageOptions= [
  { label: '中文', value: 'zh' },
  { label: 'English', value: 'en' },
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
    { label: t('pink'), value: '#fb7299' },
    { label: t('cyan'), value: '#02BCAA' },
  ]
})

const languageChange = () => {
  setFn('Language', async originVal => {
    locale.value = settingsReactive.Language
    TrayManage.refresh()
  })
}

const themeModeChange = () => {
  setFn('ThemeMode', async originVal => {
    themeReactive.changeThemeFn(settingsReactive.ThemeMode, settingsReactive.ThemeColor)
  })
}

const themeColorChange = () => {
  setFn('ThemeColor', async originVal => {
    themeReactive.changeThemeFn(settingsReactive.ThemeMode, settingsReactive.ThemeColor)
  })
}
</script>

<style scoped>

</style>
