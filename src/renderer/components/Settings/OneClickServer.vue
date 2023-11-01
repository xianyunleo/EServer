<template>
  <a-card :title="t('oneClickStartAndStop')" class="settings-card">
    <a-row type="flex" align="middle" class="settings-card-row">
      <a-col :span="24" class='flex-vertical-center'>
        <span>{{mt('Server','ws','List')}}：</span>
        <a-select
            v-model:value="settingsReactive.OneClickServerList"
            :options="oneClickServerOptions"
            @change="oneClickServerChange"
            mode="multiple" placeholder="请选择" style="flex: 1"
        ></a-select>
      </a-col>
    </a-row>
  </a-card>
</template>

<script setup>
import {defineAsyncComponent, inject, reactive} from 'vue'
import {useMainStore} from "@/renderer/store";
import {storeToRefs} from "pinia";
import Software from "@/main/core/software/Software";
import { mt, t } from '@/shared/utils/i18n'

const props = defineProps({
  setFn: Function,
})

const { settingsReactive } = inject('GlobalProvide')
const setFn = (key, callback = null) => props.setFn(key, callback)
const ACard = defineAsyncComponent(() => {
  return new Promise((resolve) => {
    import('ant-design-vue').then((modules) => {
      resolve(modules.Card)
    })
  })
})

const mainStore = useMainStore();
const {serverSoftwareList} = storeToRefs(mainStore);
//把PHP-FPM-X.X 过滤掉
let serverList = serverSoftwareList.value.filter(item => Software.IsInstalled(item) && item.Type === 'Server');
const oneClickServerOptions = serverList.map(item => {
  let name = item.Name;
  let obj = {value: name, name};
  if (name === 'Nginx') {
    obj.disabled = true;
  }
  return obj;
});
oneClickServerOptions.unshift({label: 'PHP-FPM', value: 'PHP-FPM'});

const oneClickServerChange = () => {
  setFn('OneClickServerList')
}
</script>

<style scoped>

</style>
