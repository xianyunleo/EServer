<template>
  <a-input v-model:value='val' class='with-btn' readonly>
    <template #suffix>
      <span class='icon-wrapper' @click='selectPath'>
         <folder-open-filled class='icon' />
      </span>
    </template>
  </a-input>
</template>

<script setup>
// eslint-disable-next-line no-unused-vars
import { computed } from 'vue'
import { FolderOpenFilled } from '@ant-design/icons-vue'
import FileDialog from '@/main/utils/FileDialog'
import { replaceSlash } from '@/shared/utils/utils'


const props = defineProps(['value', 'toForwardSlash'])
const emit = defineEmits(['update:value'])


const val = computed({
  get() {
    return props.value
  },
  set(value) {
    emit('update:value', value)
  }
})

let selectPath = () => {
  let path = FileDialog.showOpenDirectory(val.value)
  if (path) {
    if (props.toForwardSlash) {
      path = replaceSlash(path)
    }
    val.value = path
  }
}

</script>

<style scoped>
</style>

