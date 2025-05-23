<template>
  <div class="content-container color-text">
    <p style="text-align: center; font-size: 18px; margin-top: 50px">{{ APP_NAME }}</p>
    <p style="text-align: center">{{ $t('Version') }}：{{ version }} {{process.arch}}</p>
    <p style="text-align: center">
      {{ t('OfficialSite') }}：<a @click="openUrl(OFFICIAL_URL)">{{ OFFICIAL_HOST }}</a>
    </p>
    <p style="text-align: center">
      {{ t('Doc') }}：<a @click="openUrl(`${OFFICIAL_URL}/doc`)">{{ `${OFFICIAL_HOST}/doc` }}</a>
    </p>
    <p style="text-align: center">
      Github：<a @click="openUrl('http://github.com/xianyunleo/EServer')"
        >github.com/xianyunleo/EServer</a
      >
    </p>
  </div>
</template>

<script setup>
import { APP_NAME, OFFICIAL_HOST, OFFICIAL_URL } from '@/shared/utils/constant'
import Opener from '@/renderer/utils/Opener'
import { t } from '@/renderer/utils/i18n'
import {onMounted, ref} from 'vue'
import Ipc from '@/renderer/utils/Ipc'
import process from 'process'

const version = ref('')
onMounted(async () => {
  version.value = await Ipc.call('appGetVersion')
})

const openUrl = (url) => {
  Opener.openUrl(url)
}
</script>

<style scoped></style>
