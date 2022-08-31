<template>
  <a-modal
      title="MySQL修改密码"
      ok-text="确认"
      cancel-text="取消"
      @ok="resetClick"
      v-model:visible="visible"
      centered
      :maskClosable="false">
    <div class="modal-content">
      <a-form
          :model="formData"
          ref="formRef"
          :label-col="{ span: 5}"
          :wrapper-col="{ span: 18 }"
          autocomplete="off">
        <a-form-item label="MySQL版本" name="version"  :rules="[{ required: true, message: '请选择MySQL版本!' }]">
          <a-select style="width: 150px" v-model:value="formData.version" :options="mysqlVersionList">
          </a-select>
        </a-form-item>
        <a-form-item label="新密码"  name="newPwd" :rules="[{ required: true, message: '请输入新密码!' }]">
          <a-input v-model:value="formData.newPwd"/>
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<script setup>
import {ref,computed,defineProps,defineEmits} from "vue";
import SoftwareExtend from "@/main/core/software/SoftwareExtend";
import Database from "@/main/core/Database";
import MessageBox from "@/renderer/utils/MessageBox";
import {message} from "ant-design-vue";
import ProcessExtend from "@/main/core/ProcessExtend";
import {sleep} from "@/shared/utils/utils";

const props = defineProps(['show'])
const emit = defineEmits(['update:show'])

const visible = computed({
  get() {
    return props.show;
  },
  set(value) {
    emit('update:show', value);
  }
})
const formRef = ref();
const formData = ref({});
const mysqlVersionList = ref([]);

let list = SoftwareExtend.getMySQLList();
mysqlVersionList.value = list.map(item => {
  return {value: item.version, label: item.name};
});

const resetClick = async () => {
  try {
    let values = await formRef.value.validateFields();
    visible.value = false;
    formRef.value.resetFields();
    await reset(values.version, values.newPwd);
  } catch (errorInfo) {
    console.log('Validate Failed:', errorInfo);
  }
};
const reset = async (version, newPwd) => {
  try {
    message.info('重置中，请等待...');
    await sleep(100);
    await ProcessExtend.killByName('mysqld');
    await Database.resetMySQLPassword(version, newPwd);
    message.info('重置MySQL密码成功！')
  } catch (error) {
    MessageBox.error(error.message ?? error, '重置MySQL密码出错！');
  }
};

</script>

<style scoped>

</style>