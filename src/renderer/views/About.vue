<template>
  <div class="content-container color-text">
    <p style="text-align: center;font-size: 18px;margin-top: 50px">{{ APP_NAME }} 集成服务环境</p>
    <p style="text-align: center">{{$t("Version")}}：{{version}}</p>
    <p style="text-align: center">
      {{t('OfficialSite')}}：<a @click="openUrl('http://www.eserver.app')">www.eserver.app</a>
    </p>
    <p style="text-align: center">
      {{t('Doc')}}：<a @click="openUrl('http://www.eserver.app/doc')">www.eserver.app/doc</a>
    </p>
    <p style="text-align: center">
      Github：<a @click="openUrl('http://github.com/xianyunleo/EServer')">github.com/xianyunleo/EServer</a>
    </p>
  </div>
</template>

<script setup>
import App from "@/main/App";
import {APP_NAME} from "@/shared/utils/constant";
import Native from "@/main/utils/Native";
import { mt, t } from '@/shared/utils/i18n'

const version = App.getVersion();

let openUrl = (url) => {
  Native.openUrl(url);
}
</script>

<style scoped>

</style>
