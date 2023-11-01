<template>
  <a-modal
    title="Set Language"
    v-model:open="visible"
    centered :maskClosable="false">
    <div class="modal-content">
      <span> {{ t('Language') }} (Language)：</span>
      <a-select
        v-model:value='settingsReactive.Language'
        :options='languageOptions' @change='languageChange'
        placeholder='请选择' style='width: 200px'
      ></a-select>
    </div>
    <template #footer>
      <a-button key="submit" type="primary"  @click="handleOk">{{t('Confirm')}}</a-button>
    </template>
  </a-modal>
</template>

<script setup>
import {t} from "@/shared/utils/i18n";
import {computed, inject} from "vue";
import TrayManage from "@/main/TrayManage";
import Settings from "@/main/Settings";
import MessageBox from "@/renderer/utils/MessageBox";
const { settingsReactive } = inject('GlobalProvide')
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const props =  defineProps({
  show:Boolean,
})
const emit = defineEmits(['update:show'])

const visible = computed({
  get() {
    return props.show;
  },
  set(value) {
    emit('update:show', value);
  }
});
const languageOptions= [
  { label: '中文', value: 'zh' },
  { label: 'English', value: 'en' },
]

const handleOk = () => {
  visible.value = false
}

const languageChange = () => {
  try {
    Settings.set('Language', settingsReactive.Language)
    locale.value = settingsReactive.Language
    TrayManage.refresh()
  } catch (error) {
    MessageBox.error(error.message ?? error, t('anErrorOccurredDuring', [t('set')]))
  }

}
</script>

<style scoped>

</style>
