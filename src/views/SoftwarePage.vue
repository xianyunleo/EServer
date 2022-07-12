<template>
  <div class="content-container">
    <div class="category">
      <a-radio-group v-model:value="radioGroupVal" button-style="solid" @change="radioGroupChange">
        <a-radio-button value="Server">服务</a-radio-button>
        <a-radio-button value="DataBase">数据库</a-radio-button>
        <a-radio-button value="PHP">PHP</a-radio-button>
        <a-radio-button value="Tool">工具</a-radio-button>
      </a-radio-group>
    </div>


    <div class="soft-list piece">
      <div class="soft-head">
        <div class="soft-item">
          <div class="soft-item-content">
            <div class="soft-item-avatar">
              <span></span>
            </div>
            <div class="soft-item-title">软件名称</div>
            <div class="soft-item-desc">说明</div>
            <div class="soft-item-operate">操作</div>
          </div>
        </div>
      </div>

      <div class="soft-body">
        <div class="soft-item" v-for="item in softItems" :key="item.key">
          <div class="soft-item-content">
            <div class="soft-item-avatar">
              <img :src="item.Icon">
            </div>
            <div class="soft-item-title">{{ item.Name }}</div>
            <div class="soft-item-desc">{{ item.Desc }}</div>
            <div class="soft-item-operate">
              <a-button type="primary" @click="clickDownload">安装</a-button>
            </div>
          </div>
          <div class="soft-item-progress">
            <a-progress :percent="50" :show-info="false"   status="active" />
            <div class="progress-info">
              <div>52M/100M</div>
              <div>↓0KiB/S</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup>

import {getList} from "@/main/software";
import {ref} from "vue";
import Downloader from "@/main/Downloader";

const defaultRadioVal = 'Server';
let softItems = ref([]);
let radioGroupVal = ref(defaultRadioVal);
let radioGroupChange = () => {
  setList(radioGroupVal.value);
}

let setList = (type) => {
  try {
    softItems.value = getList(type);
  } catch (e) {
    console.log(e)
  }
}

let clickDownload = ()=>{
  let Downloader = downloader();
}

setList(defaultRadioVal);


</script>

<style scoped>
.category {
  margin-top: 10px;
  text-align: center;
}

.category >>> .ant-radio-button-wrapper {
  width: 120px;
  text-align: center;
  height: 40px;
  line-height: 40px;
}

.soft-list {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  margin-bottom: 10px;
  overflow: hidden;
  flex: 1;
}

.soft-list >>> .ant-btn {
  height: 32px;
}

.soft-item {
  padding: 12px 0;
  color: #000000d9;
  border-bottom: 1px solid #f0f0f0;
}

.soft-item .soft-item-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.soft-head .soft-item {
  background: #fafafa;
}

.soft-body{
  flex: 1;
  overflow: auto;
}

.soft-body .soft-item:hover {
  background: #fafafa;
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

.soft-item-progress {
  color: #9b9b9b;
  padding: 10px 10px 0 10px;
}

.soft-item-progress .progress-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.soft-item-operate {
  width: 150px;
  text-align: center;
}
</style>
