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
import { computed } from 'vue'
import { FolderOpenFilled } from '@ant-design/icons-vue'
import FileDialog from '@/main/utils/FileDialog'

const props = defineProps(['value', 'toForwardSlash', 'filters'])
const emit = defineEmits(['update:value'])

const val = computed({
  get() {
    return props.value
  },
  set(value) {
    emit('update:value', value)
  }
})

const selectPath = () => {
  const filters = props.filters ?? []
  let path = FileDialog.showOpenFile(val.value, filters)
  if (path) {
    if (props.toForwardSlash) {
      path = path.replaceSlash()
    }
    val.value = path
  }
}

</script>

<style scoped>
</style>

