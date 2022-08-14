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
    <a-button type="primary">保存</a-button>
  </div>
</template>

<script setup>
import {ref,defineProps,toRef}  from "vue";

//import Website from "@/main/Website";

const props = defineProps({
  confInfo: {type: Object, required: true},
})
let formData = toRef(props,'urlRewrite');

let rewriteOptions = ref([
  {
    value: 'jack',
    label: 'Jack',
  }, {
    value: 'lucy',
    label: 'Lucy',
  },
])

let rewriteChange = (val)=>{
  formData.value.urlRewrite = val;
}
</script>

<style scoped>

</style>