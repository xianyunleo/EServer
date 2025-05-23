<template>
  <div class="content-container">
    <div class="category">
      <a-radio-group v-model:value="typeSelected" button-style="solid" @change="radioGroupChange">
        <a-radio-button :value="AllType">{{ t('All') }}</a-radio-button>
        <a-radio-button :value="ChildAppTypes.Server">{{ t('Server') }}
        </a-radio-button>
        <a-radio-button :value="ChildAppTypes.PHP">PHP</a-radio-button>
        <a-radio-button :value="ChildAppTypes.Tool">{{ t('Tool') }}</a-radio-button>
      </a-radio-group>
    </div>

    <div class="app-list piece">
      <div class="app-head">
        <div class="app-item">
          <div class="app-item-content">
            <div class="app-item-avatar"><span></span></div>
            <div class="app-item-title">{{ t('Name') }}</div>
            <div class="app-item-desc">{{ t('Desc') }}</div>
            <div class="app-item-operate">{{ t('Operation') }}</div>
          </div>
        </div>
      </div>

      <div class="app-body">
        <template v-for="item in customChildAppList" :key="item.Name">
          <div v-if="item.show" class="app-item">
            <div class="app-item-content">
              <div class="app-item-avatar"><span></span></div>
              <div class="app-item-title">{{ item.Name }}</div>
              <div class="app-item-desc">{{ t(item.Desc) }}</div>
              <div class="app-item-operate">
                <a-button type="primary" danger style="margin-right: 5px" @click="del(item.Name)">{{ t('Delete') }}
                </a-button>
                <a-button type="primary" style="margin-right: 5px" @click="showAddDialog(item)">{{ t('Modify') }}
                </a-button>
                <a-button v-if="item.CanOpen" @click="openApp(item)">{{ t('Open') }}</a-button>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <a-card size="small">
      <div style="display: flex; justify-content: space-between">
        <a-button type="primary" :icon="h(AppstoreAddOutlined)" @click="showAddDialog">{{ t('Add') }}</a-button>
      </div>
    </a-card>
  </div>

  <a-modal width="600px" :title="mt('Add')" :ok-text="t('Submit')" :cancel-text="t('Cancel')" @ok="save"
           v-model:open="visible" centered :maskClosable="false">
    <div class="modal-content">
      <a-form ref="formRef" :model="formData" name="basic" autocomplete="off">
        <a-form-item label="Type" name="Type" :rules="[{ required: true}]">
          <a-select style="width: 120px;" v-model:value="formData.Type" :options="typeOptions" />
        </a-form-item>
        <a-form-item label="Control Process Mode" name="ctrlServerMode" :rules="[{ required: true}]"
                     v-if="formData.Type==ChildAppTypes.Server">
          <a-select style="width: 180px;" v-model:value="formData.ctrlServerMode" :options="ctrlServerModeOptions" />
        </a-form-item>

        <a-form-item label="Name" name="Name" :rules="[{ required:true, message: t('cannotBeEmpty')}]">
          <a-input v-model:value="formData.Name" spellcheck="false" :disabled="!!primaryName"
                   :placeholder="formData.Type==ChildAppTypes.PHP?'php-x.x.x':''"/>
        </a-form-item>

        <a-form-item label="Server Name" name="ServerName" v-if="isRealServer(formData.Type)">
          <a-tooltip
            :title="'In the Home page, instead of \'Name\' display.'+ ( primaryName?`Restart ${APP_NAME} to take effect`:'')">
            <a-input v-model:value="formData.ServerName" spellcheck="false" placeholder="" />
          </a-tooltip>
        </a-form-item>

        <a-form-item label="Control Process Path" name="ControlProcessPath"
                     v-if="formData.Type==ChildAppTypes.Server && formData.ctrlServerMode==1"
                     :rules="[{ required: true, message: t('cannotBeEmpty')}]">

          <InputOpenFileDialog v-model:value='formData.ControlProcessPath' :toForwardSlash='true'
                               :placeholder="isWindows?'bin/pg_ctl.exe':'bin/pg_ctl'" />
        </a-form-item>

        <a-form-item label="Server Process Path" name="ServerProcessPath" v-if="isRealServer(formData.Type)"
                     :rules="[{ required: true, message: t('cannotBeEmpty')}]">

          <InputOpenFileDialog v-model:value='formData.ServerProcessPath' :toForwardSlash='true'
                               :placeholder="getServerProcessPathPlaceholder()" />
        </a-form-item>

        <a-form-item label="Start Server Args" name="StartServerArgs" v-if="isRealServer(formData.Type)"
                     :rules="[{ required: formData.ctrlServerMode==1, message: t('cannotBeEmpty')}]">
          <a-input v-model:value="formData.StartServerArgs" spellcheck="false"
                   :placeholder="getStartServerArgsPlaceholder()" />
        </a-form-item>
        <a-form-item label="Stop Server Args" name="StopServerArgs"
                     v-if="formData.Type==ChildAppTypes.Server && formData.ctrlServerMode==1">
          <a-input v-model:value="formData.StopServerArgs" spellcheck="false" />
        </a-form-item>

        <a-form-item label="App Path" :name="isMacOS?'WorkDir':'ProcessPath'" v-if="formData.Type==ChildAppTypes.Tool"
                     :rules="[{ required: true, message: t('cannotBeEmpty')}]">
          <InputOpenFileDialog method="showOpenApp" v-model:value="formData.ProcessPath" :toForwardSlash="true"
                               v-if="isWindows" />
          <InputOpenFileDialog method="showOpenApp" v-model:value="formData.WorkDir" :toForwardSlash="true"
                               v-if="isMacOS" />
        </a-form-item>

        <a-form-item :label="t('Desc')" name="Desc">
          <a-input v-model:value="formData.Desc" spellcheck="false" />
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>
<script setup>
import { h, reactive, ref } from 'vue'
import { mt, t } from '@/renderer/utils/i18n'
import { useMainStore } from '@/renderer/store'
import { storeToRefs } from 'pinia'
import { AppstoreAddOutlined,} from '@ant-design/icons-vue'
import { isRealServer } from '@/shared/utils/childApp'
import { ChildAppTypes } from '@/main/utils/constant'
import { isMacOS, isWindows } from '@/main/utils/utils'
import InputOpenFileDialog from '@/renderer/components/Input/InputOpenFileDialog.vue'
import Opener from '@/renderer/utils/Opener'
import CustomChildApp from '@/main/services/childApp/CustomChildApp'
import { message } from 'ant-design-vue'
import { APP_NAME } from '@/shared/utils/constant'

const store = useMainStore()
const { customChildAppList } = storeToRefs(store)
const formRef = ref()
const AllType = 'AllType'
const typeSelected = ref(AllType)
const visible = ref(false)
const primaryName = ref('')
const formData = reactive({
  Type: ChildAppTypes.Server,
  ctrlServerMode: 0,
  Name: '',
  WorkDir: '',
  ServerName: '',
  ControlProcessPath: '',
  ServerConfPath: '',
  ServerProcessPath: '',
  StartServerArgs: '',
  StopServerArgs: '',
  Desc: ''
})

const typeOptions = [
  { value: ChildAppTypes.Server, label: t('Server') },
  { value: ChildAppTypes.PHP, label: 'PHP' },
  { value: ChildAppTypes.Tool, label: t('Tool') }
]
const ctrlServerModeOptions = [
  { value: 0, label: 'Server Process' },
  { value: 1, label: 'Control Process' }
]

const setShowList = (type) => {
  for (const item of customChildAppList.value) {
    if (type === AllType) {
      item.show = true
    } else {
      item.show = type === item.Type
    }
  }
}

setShowList(AllType)

const radioGroupChange = () => setShowList(typeSelected.value)

const showAddDialog = (item = null) => {
  visible.value = true
  formRef?.value?.resetFields()
  if (item) {
    Object.assign(formData, item)
    primaryName.value = item.Name
  } else {
    primaryName.value = ''
  }
}

const save = async () => {
  let values
  try {
    values = await formRef.value.validate()
    if (values.Type === ChildAppTypes.Tool) {
      values.CanOpen = true
    }
  } catch (errorInfo) {
    console.log('Validate Failed:', errorInfo)
    return
  }
  if (!primaryName.value && customChildAppList.value.find(item => item.Name === values.Name)) {
    await message.error('Names cannot be repeated')
    return
  }
  if (primaryName.value) {
    await CustomChildApp.modify(primaryName.value, values)
  } else {
    await CustomChildApp.add(values)
  }

  await store.refreshCustomChildAppList()
  typeSelected.value = AllType
  setShowList(AllType)
  visible.value = false
}

const del = async (Name) => {
  await CustomChildApp.del(Name)
  await store.refreshCustomChildAppList()
  setShowList(typeSelected.value)
}

const getServerProcessPathPlaceholder = () => {
  if (formData.Type === ChildAppTypes.PHP) {
    return isWindows ? 'php-cgi.exe' : 'sbin/php-fpm'
  }
  return ''
}
const getStartServerArgsPlaceholder = () => {
  if (formData.Type === ChildAppTypes.PHP) {
    return isWindows ? '-b 127.0.0.1:9200' : '-F'
  }
  return '-c xxx.conf'
}

const openApp = (item) => {
  let appPath
  if (isWindows) {
    appPath = item.ProcessPath
  } else if (isMacOS) {
    appPath = item.WorkDir
  }
  Opener.openApp(appPath)
}
</script>
<style scoped lang="less">
@import '@/renderer/assets/css/var';

.category {
  text-align: center;

  :deep(.ant-radio-button-wrapper) {
    width: 120px;
    text-align: center;
    height: 40px;
    line-height: 40px;
  }
}

.app-list {
  color: @colorText;
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  margin-bottom: 10px;
  overflow: hidden;
  flex: 1;
}

.app-item {
  padding: 12px 0;
  border-bottom: 1px solid @colorBorderSecondary;

  .app-item-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

.app-body {
  flex: 1;
  overflow: auto;

  .app-item-content {
    height: calc(@controlHeight * 1px);
  }

  .app-item {
    &:hover {
      background: @colorBgTextHover;
    }
  }
}

.app-item-avatar {
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

.app-item-title {
  width: 150px;
}

.app-item-desc {
  flex: 2;
}

.app-item-operate {
  flex: 1;
  justify-content: flex-start;
  display: flex;
  align-items: center;
  padding-right: 5px;
}
</style>
