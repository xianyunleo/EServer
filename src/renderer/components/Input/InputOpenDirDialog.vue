<template>
  <a-input v-model:value='val' class='with-btn' readonly>
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

const props = defineProps({ toForwardSlash: Boolean })
const callStatic = Ipc.callStatic

const val = defineModel('value', { type: String })

const selectPath = async () => {
  let path = await callStatic('FileDialog', 'showOpenDirectory')
  if (path) {
    if (props.toForwardSlash) {
      path = path.replaceSlash()
    }
    val.value = path
  }
}
</script>

<style scoped></style>
