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
import { computed } from 'vue'
import { FolderOpenFilled } from '@ant-design/icons-vue'
const callStatic = window.api.callStatic

const props = defineProps({ value: String, toForwardSlash: Boolean, filters: Array })
const emit = defineEmits(['update:value'])

const val = computed({
  get() {
    return props.value
  },
  set(value) {
    emit('update:value', value)
  }
})

const selectPath = async () => {
  const filters = props.filters ?? []
  let path = await callStatic('FileDialog', 'showOpenFile', val.value, filters)
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
