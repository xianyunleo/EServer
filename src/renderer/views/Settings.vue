<template>
  <div class='content-container' style="overflow:scroll">
    <App :setFn='setFun' />
    <OneClickServer :setFn='setFun' />
    <EnvVar :setFn='setFun' />
    <Other :setFn='setFun' />
    <UserPwd v-if='!isWindows' />
  </div>
</template>

<script setup>
import App from '@/renderer/components/Settings/app.vue'
import OneClickServer from '@/renderer/components/Settings/OneClickServer.vue'
import Other from '@/renderer/components/Settings/Other.vue'
import EnvVar from '@/renderer/components/Settings/EnvVar.vue'
import UserPwd from '@/renderer/components/Settings/UserPwd.vue'
import Settings from '@/main/Settings'
import { isWindows } from '@/main/utils/utils'
import MessageBox from '@/renderer/utils/MessageBox'
import {inject} from 'vue'
import {t}  from '@/shared/utils/i18n'

const { settingsReactive } = inject('GlobalProvide')

//公共的设置函数
const setFun = async (key, callback = null) => {
  const originVal = Settings.get(key)
  try {
    if (callback) {
      const res = await callback(originVal)
      if (res === false) {
        return
      }
      //callback没有返回值
      if (res === undefined) {
        Settings.set(key, settingsReactive[key])
      } else {
        settingsReactive[key] = res
        Settings.set(key, res)
      }
    } else {
      //无callback的情况
      Settings.set(key, settingsReactive[key])
    }
  } catch (error) {
    settingsReactive[key] = originVal
    MessageBox.error(error.message ?? error, t('errorOccurredDuring', [t('set')]))
  }
}

</script>

<style lang='less'>
.settings-card {
  margin-bottom: 10px;

  .settings-card-row {
    margin-top: 20px;
  }

  .settings-card-row:first-child {
    margin-top: 0;
  }

  &:last-child {
    margin-bottom: 20px;
  }
}

.flex-vertical-center {
  display: flex;
  align-items: center;
}

.disabled-text {
  color: #999;
}

.settings-card-content {
  display: flex;
}

.settings-switch {
  margin-right: 10px;
}
</style>
