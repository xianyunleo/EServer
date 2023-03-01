<template>
  <a-card title="电脑的用户密码" class="settings-card">
    <a-row type="flex" align="middle" class="settings-card-row">
      <a-col :span="12">
        <a-input-password v-model:value="userPwd" readonly/>
      </a-col>
      <a-col :span="10" :offset="1">
        <a-button type="primary" @click="resetUserPwd">重设</a-button>
      </a-col>
    </a-row>
  </a-card>
  <user-pwd-modal v-model:show="userPwdModalShow" v-model:right-pwd="userPwd"/>
</template>

<script setup>
import UserPwdModal from "@/renderer/components/UserPwdModal.vue";
import {ref} from "vue";
import Settings from "@/main/Settings";

const userPwd = ref(Settings.get('userPwd'));
const userPwdModalShow = ref(false);
const resetUserPwd = () => {
  userPwdModalShow.value = true;
}
</script>

<style scoped>

</style>