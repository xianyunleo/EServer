<template>
  <div class="content-container">
    <one-click-server />
    <other />
    <env-var />
    <user-pwd v-if="!isWindows"/>
  </div>
</template>

<script setup>
import OS from "@/main/core/OS";
import OneClickServer from "@/renderer/components/Settings/OneClickServer.vue";
import Other from "@/renderer/components/Settings/Other.vue";
import EnvVar from "@/renderer/components/Settings/EnvVar.vue";
import UserPwd from "@/renderer/components/Settings/UserPwd.vue";

const isWindows = OS.isWindows();

</script>

<style lang="scss">
.settings-card {
  margin-top: 10px;
  .settings-card-row {
    margin-top: 20px;
  }
  .settings-card-row:first-child{
    margin-top: 0;
  }

  &:last-child{
    margin-bottom: 20px;
  }
}

.flex-vertical-center {
  display: flex;
  align-items: center;
}

.disabled-text{
  color:#999;
}

.settings-card-content {
  display: flex;
}

.settings-switch {
  margin-right: 10px;
}
</style>
