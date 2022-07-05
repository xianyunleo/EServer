<template>
  <div class="content-container">
    <a-tabs class="tabs piece" v-model:activeKey="activeTabKey" @change="tabChange">
      <a-tab-pane key="Server" tab="服务"></a-tab-pane>
      <a-tab-pane key="DataBase" tab="数据库" force-render></a-tab-pane>
      <a-tab-pane key="PHP" tab="PHP"></a-tab-pane>
    </a-tabs>

    <div class="soft-list piece">
      <div class="soft-item">
        <div class="soft-item-avatar">
          <span></span>
        </div>
        <div class="soft-item-title">软件名称</div>
        <div class="soft-item-desc">说明</div>
      </div>
      <div class="soft-item" v-for="item in softItems" :key="item.key">
        <div class="soft-item-avatar">
          <img :src="item.Icon">
        </div>
        <div class="soft-item-title">{{ item.Name }}</div>
        <div class="soft-item-desc">{{ item.Desc }}</div>
        <div class="soft-item-operate">
          <a-button type="primary">安装</a-button>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup>

import {getList} from "@/main/software";


let softItems = [];

let tabChange = (activeTabKey) => {
  console.log(activeTabKey)
  try {
    softItems = getList(activeTabKey);
  } catch (e) {
    console.log(e)
  }
}

tabChange('Server');


</script>

<style scoped>

.soft-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  color: #000000d9;
  border-bottom: 1px solid #f0f0f0;
}

.soft-item:hover {
  background: #eee;
}

.soft-item-avatar {
  margin-left: 16px;
  margin-right: 16px;
  display: flex;
}

.soft-item-avatar span {
  width: 25px;
}

.soft-item-avatar img {
  width: 25px;
  height: 25px;
}

.soft-item-title {
  width: 150px;
}

.soft-item-desc {
  flex: 1;
}
</style>
