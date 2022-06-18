<template>
  <a-input v-model:value="val" class="with-btn">
    <template #suffix>
      <span class="icon-wrapper">
         <search-outlined style="color: rgba(0, 0, 0, 0.45);" @click="searchClick"/>
      </span>
    </template>
  </a-input>
</template>

<script>
import {ref, defineComponent} from "vue";
import {SearchOutlined} from '@ant-design/icons-vue';

export default defineComponent({
  name: 'InputWithSearch',
  props: {
  },
  components: {
    SearchOutlined
  },
  setup(props, context) {
    let val = ref('');
    let searchClick = () => {
      context.emit('search', val.value)
    }
    return {searchClick,val}
  }

});

</script>

<style scoped>

</style>