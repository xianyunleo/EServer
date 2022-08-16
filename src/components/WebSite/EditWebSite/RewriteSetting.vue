<template>
  <a-form
      name="rewrite"
      :label-col="{ span: 0}"
      :wrapper-col="{ span: 24 }"
      autocomplete="off">

    <a-form-item label="">
      <a-select
          :options = "rewriteOptions"
          style="width: 120px"
          @change="rewriteChange"
      >
      </a-select>
    </a-form-item>
    <a-form-item label="">
      <a-textarea v-model:value="formData.urlRewrite" :autosize="{ minRows: 8, maxRows: 16}" />
    </a-form-item>
  </a-form>

  <div style="text-align: center">
    <a-button type="primary" @click="save">保存</a-button>
  </div>
</template>

<script setup>
import {ref,defineProps,toRef,inject}  from "vue";
import Website from "@/main/Website";
import MessageBox from "@/main/MessageBox";
import {message} from "ant-design-vue";

//import Website from "@/main/Website";
const serverName = inject('serverName');

const props = defineProps({
  confInfo: {type: Object, required: true},
})
let formData = toRef(props,'confInfo');

let rewriteOptions = ref([
  {
    value: '测试规则',
    label: '##',
  }
])

const rewriteChange = (val)=>{
  formData.value.urlRewrite = val;
}

const save = async () => {
  try {
    await Website.saveRewrite(formData.value.serverName, formData.value.urlRewrite);
    message.info('保存成功');
  }catch (error){
    MessageBox.error(`保存失败，${error.message}`)
  }
}
</script>

<style scoped>

</style>