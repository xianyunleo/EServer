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
      <a-textarea v-model:value="rewriteContent" :autosize="{ minRows: 6, maxRows: 10}" />
    </a-form-item>
  </a-form>

  <div style="text-align: center">
    <a-button type="primary">保存</a-button>
  </div>
</template>

<script setup>
import {ref}  from "vue";

let rewriteOptions = ref([
  {
    value: 'jack',
    label: 'Jack',
  }, {
    value: 'lucy',
    label: 'Lucy',
  },
])
let rewriteContent = ref();
let rewriteChange = (val)=>{
  rewriteContent.value = val;
}
</script>

<style scoped>

</style>