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
import App from '@/renderer/views/Settings/components/App.vue'
import Server from '@/renderer/views/Settings/components/Server.vue'
import Timer from '@/renderer/views/Settings/components/Timer.vue'
import Other from '@/renderer/views/Settings/components/Other.vue'
import EnvVar from '@/renderer/views/Settings/components/EnvVar.vue'
import UserPwd from '@/renderer/views/Settings/components/UserPwd.vue'
import { isWindows } from '@/shared/utils/utils2'
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
