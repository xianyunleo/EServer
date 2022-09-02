<template>
  <a-input v-model:value="val" class="with-btn" readonly>
    <template #suffix>
      <span class="icon-wrapper" @click="selectPath">
         <folder-open-filled style="color: rgba(0, 0, 0, 0.45);"/>
      </span>
    </template>
  </a-input>
</template>

<script setup>
// eslint-disable-next-line no-unused-vars
import {defineProps, defineEmits, computed, toRef} from "vue";
import {FolderOpenFilled} from "@ant-design/icons-vue";
import FileDialog from "@/renderer/utils/FileDialog";


const props = defineProps(['value'])
const emit = defineEmits(['update:value'])


const val = computed({
  get() {
    return props.value;
  },
  set(value) {
    emit('update:value', value);
  }
})

let selectPath = () => {
  let path = FileDialog.showOpenDirectory(val.value);
  if (path) {
    val.value = path;
  }
}

</script>

<style scoped>

</style>