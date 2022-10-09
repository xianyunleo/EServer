<template>
  <a-card title="服务设置" class="settings-card">
    <div class="settings-card-content">
      <span>默认MySQL版本</span>
      <a-select style="width: 150px" v-model:value="defaultMySQL" :options="mysqlVersionList" @change="setDefaultMySQL">
      </a-select>
    </div>
  </a-card>
</template>

<script setup>
import {ref} from "vue";
import SoftwareExtend from "@/main/core/software/SoftwareExtend";
import Settings from "@/main/Settings";

const mysqlVersionList = ref([]);
const defaultMySQL = ref(Settings.get('DefaultMySQL'));

let list = SoftwareExtend.getMySQLList();
mysqlVersionList.value = list.map(item => {
  return {value: item.version, label: item.name};
});

const setDefaultMySQL = () => {
  Settings.set('DefaultMySQL', defaultMySQL)
}

</script>

<style scoped lang="scss">
.settings-card {
  margin-top: 10px;
}

.settings-card-content {
  display: flex;
}
</style>
