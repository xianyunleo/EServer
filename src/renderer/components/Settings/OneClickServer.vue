<template>
  <a-card title="一键启动和停止" class="settings-card">
    <a-row type="flex" align="middle" class="settings-card-row">
      <a-col :span="24" style="display:flex;align-items: center">
        <span>服务列表：</span>
        <a-select
            v-model:value="oneClickServerList"
            :options="oneClickServerOptions"
            @change="oneClickServerChange"
            mode="multiple"
            placeholder="请选择"
            style="width: 500px"
        ></a-select>
      </a-col>
    </a-row>
  </a-card>
</template>

<script setup>
import {ref} from "vue";
import Settings from "@/main/Settings";
import {useMainStore} from "@/renderer/store";
import {storeToRefs} from "pinia";
import Software from "@/main/core/software/Software";
import MessageBox from "@/renderer/utils/MessageBox";

const oneClickServerOptions = ref([]);
const oneClickServerList = ref(Settings.get('OneClickServerList'));
const mainStore = useMainStore();
const {serverSoftwareList} = storeToRefs(mainStore);
//把PHP-FPM-X.X 过滤掉
let serverList = serverSoftwareList.value.filter(item => Software.IsInstalled(item) && item.Type === 'Server');
oneClickServerOptions.value = serverList.map(item => {
  let name = item.Name;
  let obj = {value: name, name};
  if (name === 'Nginx') {
    obj.disabled = true;
  }
  return obj;
});
oneClickServerOptions.value.unshift({label: 'PHP-FPM', value: 'PHP-FPM'});
const oneClickServerChange = (val) => {
  const originVal = Settings.get('OneClickServerList');
  try {
    Settings.set('OneClickServerList', val);
  } catch (error) {
    MessageBox.error(error.message ?? error, '设置出错！');
    oneClickServerList.value = originVal;
  }
}
</script>

<style scoped>

</style>