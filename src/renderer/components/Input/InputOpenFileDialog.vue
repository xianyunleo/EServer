<template>
  <a-input v-model:value='val' class='with-btn' :readonly="props.readonly">
    <template #suffix>
      <span class='icon-wrapper' @click='selectPath'>
        <FolderOpenFilled class="icon" />
      </span>
    </template>
  </a-input>
</template>

<script setup>
import { computed } from 'vue'
import { FolderOpenFilled } from '@ant-design/icons-vue'
import Ipc from '@/renderer/utils/Ipc'
const callStatic = Ipc.callStatic

const props = defineProps({ method: String, value: String, toForwardSlash: Boolean, filters: Array, readonly: Boolean })
const emit = defineEmits(['update:value'])

const val = computed({
  get() {
    return props.value
  },
  set(value) {
    emit('update:value', value)
  }
})
const method = props.method ? props.method : 'showOpenFile'
const selectPath = async () => {
  const filters = props.filters ?? []
  let path = await callStatic('FileDialog', method, val.value, filters)
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
