<template>
  <a-card size="small" :title="t('theUserPwdForThisComputer')" class="settings-card">
    <a-row type="flex" align="middle" class="settings-card-row">
      <a-col :span="12">
        <a-input-password v-model:value="userPwd" readonly/>
      </a-col>
      <a-col :span="10" :offset="1">
        <a-button type="primary" @click="resetUserPwd">{{t('goToSettings')}}</a-button>
      </a-col>
    </a-row>
  </a-card>
  <user-pwd-modal v-if="userPwdModalShow" v-model:show="userPwdModalShow" v-model:right-pwd="userPwd"/>
</template>

<script setup>
import UserPwdModal from "@/renderer/components/UserPwdModal.vue";
import { ref } from 'vue'
import Settings from "@/main/Settings";
import {t}  from '@/renderer/utils/i18n'
import { createAsyncComponent } from '@/renderer/utils/utils'

const ACard = createAsyncComponent(import('ant-design-vue'), 'Card')
const userPwd = ref(Settings.get('userPwd'));
const userPwdModalShow = ref(false);
const resetUserPwd = () => {
  userPwdModalShow.value = true;
}
</script>

<style scoped>

</style>
