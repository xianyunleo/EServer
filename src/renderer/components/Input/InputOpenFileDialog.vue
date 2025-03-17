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
import { FolderOpenFilled } from '@ant-design/icons-vue'
import Ipc from '@/renderer/utils/Ipc'
const callStatic = Ipc.callStatic

const props = defineProps({ method: String, toForwardSlash: Boolean, filters: Array, readonly: Boolean })

const val = defineModel('value', { type: String })
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
