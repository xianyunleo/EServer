<template>
  <div class="content-container">
    <div class="category">
      <a-radio-group v-model:value="softwareType" button-style="solid" @change="radioGroupChange">
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
        <div class="soft-item" v-for="item in softwareList" :key="item.key" v-show="item.show">

          <div class="soft-item-content">
            <div class="soft-item-avatar">
              <img :src="item.Icon">
            </div>
            <div class="soft-item-title">{{ item.Name }}</div>
            <div class="soft-item-desc">{{ item.Desc }}</div>
            <div class="soft-item-operate">
              <a-button type="primary" @click="clickDownload(item)">安装</a-button>
              <a-button type="primary" @click="clickStop(item)">停止</a-button>
            </div>
          </div>
          <div class="soft-item-progress" v-if="item.dl">
            <a-progress :percent="item.dl.percent" :show-info="false" status="active"/>
            <div class="progress-info">
              <div>{{ item.dl.completedSize }}/{{ item.dl.totalSize }}</div>
              <div>↓{{ item.dl.perSecond }}/S</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup>

import Downloader from "@/main/Downloader";
import {useMainStore} from '@/store'
import {storeToRefs} from 'pinia'

let mainStore = useMainStore();
const {softwareList, softwareType} = storeToRefs(mainStore)


let radioGroupChange = () => {
  setShowList(softwareType.value);
}
let setShowList = (type) => {
  for (const item of softwareList.value) {
    item.show = type === item.Type;
  }
}

let clickDownload = (item) => {
  let dl = new Downloader(item.dlInfo);
  dl.download('https://dl-cdn.phpenv.cn/release/test.zip');
  console.log('dl2',item.dl)
}
let clickStop = (item) => {
  item.dl.exit();
}

</script>

<style scoped lang="scss">
.category {
  margin-top: 10px;
  text-align: center;

  :deep(.ant-radio-button-wrapper) {
    width: 120px;
    text-align: center;
    height: 40px;
    line-height: 40px;
  }
}

.soft-list {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  margin-bottom: 10px;
  overflow: hidden;
  flex: 1;

  :deep(.ant-btn) {
    height: 32px;
  }
}


.soft-item {
  padding: 12px 0;
  color: #000000d9;
  border-bottom: 1px solid #f0f0f0;

  .soft-item-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}


.soft-head {
  .soft-item {
    background: #fafafa;
  }
}

.soft-body {
  flex: 1;
  overflow: auto;

  .soft-item {
    &:hover {
      background: #fafafa;
    }
  }
}

.soft-item-avatar {
  margin-left: 16px;
  margin-right: 16px;
  display: flex;

  > span {
    width: 25px;
  }

  > img {
    width: 25px;
    height: 25px;
  }
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

  .progress-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

.soft-item-operate {
  width: 150px;
  text-align: center;
}
</style>
