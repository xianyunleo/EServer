<template>
  <a-modal title="Set Language" v-model:open="visible" centered :maskClosable="false">
    <div class="modal-content">
      <span> {{ t('Language') }} (Language)：</span>
      <a-select
        v-model:value="store.settings.Language"
        :options="languageOpts"
        @change="languageChange"
        placeholder="请选择"
        style="width: 200px"
      ></a-select>
    </div>
    <template #footer>
      <a-button key="submit" type="primary" @click="handleOk">{{ t('Confirm') }}</a-button>
    </template>
  </a-modal>
</template>

<script setup>
import { t } from '@/renderer/utils/i18n'
import { computed } from 'vue'
import Settings from '@/main/Settings'
import MessageBox from '@/renderer/utils/MessageBox'
import { useMainStore } from '@/renderer/store'
import { changeLanguageWrapper } from '@/renderer/utils/language'

const props = defineProps({ show: Boolean })
const emit = defineEmits(['update:show'])
const store = useMainStore()
const visible = computed({
  get() {
    return props.show
  },
  set(value) {
    emit('update:show', value)
  }
})
const languageOpts = [
  { label: '中文', value: 'zh' },
  { label: 'English', value: 'en' },
  { label: 'Français', value: 'fr' }
]

const handleOk = () => {
  visible.value = false
}

const languageChange = async () => {
  //todo改调用 store.setSettings ，并测试init调用此
  try {
    Settings.set('Language', store.settings.Language)
    await changeLanguageWrapper(store.settings.Language)
    store.loadingTip = t('Initializing') //todo 删除这行？
  } catch (error) {
    MessageBox.error(error.message ?? error, t('errorOccurredDuring', [t('set')]))
  }
}
</script>

<style scoped></style>
