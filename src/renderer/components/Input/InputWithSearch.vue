<template>
  <a-input v-model:value='val' class='with-btn'>
    <template #suffix>
      <span class='icon-wrapper' @click='searchClick'>
         <search-outlined class='icon' />
      </span>
    </template>
  </a-input>
</template>

<script setup>
import { ref } from 'vue'
import { FolderOpenFilled, SearchOutlined } from '@ant-design/icons-vue'

let val = ref('')
const emits = defineEmits(['search'])
let searchClick = () => {
  emits('search', val.value)
}

</script>

<style scoped>
</style>
