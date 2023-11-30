<template>
  <a-modal
      :title="t('theUserPwdForThisComputer')"
      :ok-text="t('Submit')"
      :cancel-text="props.cancelIsExit?t('Exit'):t('Cancel')"
      @ok="saveUserPwd" @cancel="cancel"
      :ok-button-props="{disabled:okButtonDisabled}"
      v-model:open="visible"
      :right-pwd="rightPwd"
      centered
      :maskClosable="false">
    <div class="modal-content">
      <div style="margin-bottom: 10px">{{t('thisPwdIsUsedForSudoCommands')}}</div>
      <a-input-password v-model:value="userPwd" />
    </div>
  </a-modal>
</template>

<script setup>
import {computed, ref, inject} from "vue";
import Settings from "@/main/Settings";
import {message} from 'ant-design-vue';
import App from "@/main/App";
import SystemExtend from "@/main/utils/SystemExtend";
import MessageBox from "@/renderer/utils/MessageBox";
import {useMainStore} from "@/renderer/store";
import {mt,t}  from '@/shared/utils/i18n'
const store = useMainStore();

const props =  defineProps({
  show:Boolean,
  rightPwd:String,
  cancelIsExit:Boolean,
})

const emit = defineEmits(['update:show','update:rightPwd'])

const visible = computed({
  get() {
    return props.show;
  },
  set(value) {
    emit('update:show', value);
  }
});

const rightPwd = computed({
  get() {
    return props.rightPwd;
  },
  set(value) {
    emit('update:rightPwd', value);
  }
});

const userPwd = ref('');
const okButtonDisabled = ref(false);

const saveUserPwd = async () => {
  if (!userPwd.value) {
    return;
  }
  okButtonDisabled.value = true
  message.info(t('pleaseWait'));
  if (!await SystemExtend.checkUserPwd(userPwd.value)) {
    message.error(mt('Wrong','ws','Pwd'));
    okButtonDisabled.value = false;
    return;
  }
  rightPwd.value = userPwd.value;
  Settings.set('userPwd', userPwd.value);
  visible.value = false;
  if (App.initFileExists()) {
    try {
      store.loading = true;
      await App.init();
      await store.refreshSoftwareList();
      store.loading = false;
    } catch (error) {
      await MessageBox.error(error.message ?? error,t('errorOccurredDuring', [t('initializing')]));
      App.exit();
    }
  }
  okButtonDisabled.value = false;
}

const cancel = () => {
  if (props.cancelIsExit) {
    App.exit();
  } else {
    visible.value = false;
  }
}
</script>

<style scoped>

</style>
