<template>
  <a-card :title="t('theUserPwdForThisComputer')" class="settings-card">
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
import {defineAsyncComponent, ref} from "vue";
import Settings from "@/main/Settings";
import {mt,t}  from '@/shared/utils/i18n'

const userPwd = ref(Settings.get('userPwd'));
const userPwdModalShow = ref(false);
const resetUserPwd = () => {
  userPwdModalShow.value = true;
}
const ACard = defineAsyncComponent(() => {
  return new Promise((resolve) => {
    import('ant-design-vue').then((modules) => {
      resolve(modules.Card)
    })
  })
})
</script>

<style scoped>

</style>
