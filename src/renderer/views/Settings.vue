<template>
  <div class='content-container'>
    <App />
    <Server />
    <Timer />
    <EnvVar />
    <Other />
    <UserPwd v-if='!isWindows' />
  </div>
</template>

<script setup>
import App from '@/renderer/components/Settings/App.vue'
import Server from '@/renderer/components/Settings/Server.vue'
import Timer from '@/renderer/components/Settings/Timer.vue'
import Other from '@/renderer/components/Settings/Other.vue'
import EnvVar from '@/renderer/components/Settings/EnvVar.vue'
import UserPwd from '@/renderer/components/Settings/UserPwd.vue'
import { isWindows } from '@/main/utils/utils'
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
