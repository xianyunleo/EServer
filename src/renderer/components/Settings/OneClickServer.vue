<template>
  <a-card size="small" :title="t('oneClickStartAndStop')" class="settings-card">
    <a-row type="flex" align="middle" class="settings-card-row">
      <a-col :span="24" class='flex-vertical-center'>
        <span>{{mt('Server','ws','List')}}：</span>
        <a-select
            v-model:value="store.settings.OneClickServerList"
            :options="oneClickServerOptions"
            @change="oneClickServerChange"
            mode="multiple" placeholder="请选择" style="flex: 1"
        ></a-select>
      </a-col>
    </a-row>
  </a-card>
</template>

<script setup>
import {useMainStore} from "@/renderer/store";
import {storeToRefs} from "pinia";
import { mt, t } from '@/renderer/utils/i18n'
import { createAsyncComponent } from '@/renderer/utils/utils'

const ACard = createAsyncComponent(import('ant-design-vue'), 'Card')
const store = useMainStore()
const { serverList } = storeToRefs(store)
//把PHP-FPM-X.X 过滤掉
const oneClickServerOptions = serverList.value.map(item => {
  let name = item.Name;
  let obj = {value: name, name};
  if (name === 'Nginx') {
    obj.disabled = true;
  }
  return obj;
});
oneClickServerOptions.unshift({label: 'PHP-FPM', value: 'PHP-FPM'});

const oneClickServerChange = () => {
  store.setSettings('OneClickServerList')
}
</script>

<style scoped>

</style>
