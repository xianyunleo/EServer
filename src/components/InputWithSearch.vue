<template>
  <a-input v-model:value="val" class="with-btn">
    <template #suffix>
      <span class="icon-wrapper" @click="searchClick">
         <search-outlined style="color: rgba(0, 0, 0, 0.45);" />
      </span>
    </template>
  </a-input>
</template>

<script setup>
import {ref, defineEmits} from "vue";
import {SearchOutlined} from '@ant-design/icons-vue';

let val = ref('');
const emits = defineEmits(['search'])
let searchClick = () => {
  emits('search', val.value)
}

</script>

<style scoped>

</style>