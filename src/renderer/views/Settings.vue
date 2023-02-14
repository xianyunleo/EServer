<template>
  <div class="content-container">
    <a-card title="一键启动和停止" class="settings-card">
      <a-row type="flex"  align="middle" class="settings-card-row">
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
    <a-card title="其它" class="settings-card">
      <a-row type="flex"  align="middle" class="settings-card-row">
        <a-col :span="24" style="display:flex;align-items: center">
          <span>文本编辑器：</span>
          <a-input v-model:value="textEditor" readonly style="flex: 1"></a-input>
          <a-button @click="clickTextEditor" style="margin-left: 5px">...</a-button>
        </a-col>
      </a-row>
    </a-card>
    <a-card title="环境变量" class="settings-card">
      <a-row type="flex"  align="middle" class="settings-card-row">
        <a-col :span="24">
          <span>启用环境变量：</span>
          <a-switch v-model:checked="enableEnv" @change="changeEnableEnv" />
          <span style="margin-left: 20px;color: red">* 开关此项，需要重启终端后才能生效</span>
        </a-col>
      </a-row>
      <a-row type="flex" justify="space-around" align="middle" class="settings-card-row">
        <a-col :span="12" style="display: flex;align-items: center">
          <span :class="!enableEnv?'disabled-text':''">PHP-CLI版本：</span>
          <a-select style="width: 120px" :options="phpVersionList" :disabled="!enableEnv"
                    v-model:value="phpCliVersion" @change="phpCliVersionChange" />
        </a-col>
        <a-col :span="12" style="display: flex;align-items: center">
          <span :class="!enableEnv?'disabled-text':''">启用Composer：</span>
          <a-switch v-model:checked="enableComposer" @change="changeEnableComposer"
                    :disabled="!enableEnv || phpCliVersion===''" />
        </a-col>
      </a-row>
    </a-card>
    <a-card title="电脑的用户密码" class="settings-card" v-if="!isWindows">
      <a-row type="flex"  align="middle" class="settings-card-row">
        <a-col :span="12">
          <a-input-password v-model:value="userPwd"  readonly />
        </a-col>
        <a-col :span="10" :offset="1">
          <a-button type="primary" @click="resetUserPwd">重设</a-button>
        </a-col>
      </a-row>
    </a-card>
    <user-pwd-modal v-model:show="userPwdModalShow"  v-model:right-pwd="userPwd" />
  </div>
</template>

<script setup>
import {ref} from "vue";
import {message} from 'ant-design-vue';
import Env from "@/main/core/Env/Env";
import MessageBox from "@/renderer/utils/MessageBox";
import SoftwareExtend from "@/main/core/software/SoftwareExtend";
import Settings from "@/main/Settings";
import GetPath from "@/shared/utils/GetPath";
import FileDialog from "@/renderer/utils/FileDialog";
import UserPwdModal from "@/renderer/components/UserPwdModal";
import OS from "@/main/core/OS";
import {useMainStore} from "@/renderer/store";
import {storeToRefs} from "pinia";
import Software from "@/main/core/software/Software";

const isWindows = ref(OS.isWindows());

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
const oneClickServerChange = (val)=>{
  let originVal = ref(Settings.get('OneClickServerList'));
  try {
    Settings.set('OneClickServerList', val);
  } catch (error) {
    MessageBox.error(error.message ?? error, '设置出错！');
    oneClickServerList.value = originVal;
  }
}

const textEditor = ref(Settings.get('TextEditor'));

const clickTextEditor = async () => {
  let val = textEditor.value;
  let originVal = !val;
  try {
    let path = FileDialog.showOpenApp();
    if (path) {
      textEditor.value = path;
      Settings.set('TextEditor', path);
    }
  } catch (error) {
    MessageBox.error(error.message ?? error, '设置出错！');
    enableEnv.value = originVal;
  }
}

const enableEnv = ref(Settings.get('EnableEnv'));

const changeEnableEnv = async () => {
  let val = enableEnv.value;
  let originVal = !val;
  try {
    await Env.switch(val);
    Settings.set('EnableEnv', val);
    message.warning('设置成功，未生效，请重启终端！')
  } catch (error) {
    MessageBox.error(error.message ?? error, '设置出错！');
    enableEnv.value = originVal;
  }
}

const PhpVersion = Settings.get('PhpVersion') ? Settings.get('PhpVersion') : '';
const phpCliVersion = ref(PhpVersion);
const phpVersionList = ref([]);
let list = SoftwareExtend.getPHPList();
phpVersionList.value = list.map(item => {
  return {value: item.version, label: item.name};
});
phpVersionList.value.push({value: '', label: '不设置'});

const phpCliVersionChange = () => {
  let val = phpCliVersion.value;
  try {
    if (val) {
      let path = GetPath.getPhpBinPath(val);
      Env.createBinFile(path, 'php')
    } else {
      Env.deleteBinFile('php')
    }
    Settings.set('PhpVersion', val);
    message.info('设置成功，已生效，不需要重启终端！')
  } catch (error) {
    MessageBox.error(error.message ?? error, '设置出错！');
  }
}

const enableComposer = ref(Settings.get('EnableComposer'));

const changeEnableComposer = async () => {
  let val = enableComposer.value;
  let originVal = !val;
  try {
    if (val) {
      let path = GetPath.getComposerBinPath();
      Env.createBinFile(path, 'composer')
    } else {
      Env.deleteBinFile('composer')
    }
    Settings.set('EnableComposer', val);
    message.info('设置成功，已生效，不需要重启终端！')
  } catch (error) {
    MessageBox.error(error.message ?? error, '设置出错！');
    enableComposer.value = originVal;
  }
}

const userPwd = ref(Settings.get('userPwd'));
const userPwdModalShow = ref(false);
const resetUserPwd = ()=>{
  userPwdModalShow.value = true;
}

</script>

<style scoped lang="scss">
.settings-card {
  margin-top: 10px;
  .settings-card-row {
    margin-top: 20px;
  }
  .settings-card-row:first-child{
    margin-top: 00px;
  }
}

.disabled-text{
  color:#999;
}


.settings-card-content {
  display: flex;
}
</style>
