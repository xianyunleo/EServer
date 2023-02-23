<template>
  <a-modal
      title="请输入电脑的用户密码"
      ok-text="确定"
      :cancel-text="props.cancelIsExit?'退出':'取消'"
      @ok="saveUserPwd"
      @cancel="cancel"
      v-model:visible="visible"
      :right-pwd="rightPwd"
      centered
      :maskClosable="false">
    <div class="modal-content">
      <div style="margin-bottom: 10px">用户密码，用于sudo</div>
      <a-input-password v-model:value="userPwd" />
    </div>
  </a-modal>
</template>

<script setup>
import {defineProps, computed, defineEmits, ref, inject} from "vue";
import Settings from "@/main/Settings";
import {message} from 'ant-design-vue';
import App from "@/main/App";
import SystemExtend from "@/main/core/SystemExtend";
import MessageBox from "@/renderer/utils/MessageBox";
import {useMainStore} from "@/renderer/store";
const mainStore = useMainStore();

const globalSpinning = inject('globalSpinning');

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

const userPwd = ref("");

const saveUserPwd = async () => {
  if (!userPwd.value) {
    return;
  }
  message.info('验证中，请等待！');
  if (!await SystemExtend.checkUserPwd(userPwd.value)) {
    message.error('密码错误，请重新输入！');
    return;
  }
  rightPwd.value = userPwd.value;
  Settings.set('userPwd', userPwd.value);
  visible.value = false;
  if (App.initFileExists()) {
    try {
      globalSpinning.value = true;
      await App.init();
      mainStore.$reset();
      globalSpinning.value = false;
    } catch (error) {
      MessageBox.error(error.message ?? error, '软件初始化出错！');
    }
  }
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
