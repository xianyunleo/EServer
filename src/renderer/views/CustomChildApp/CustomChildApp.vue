<template>
  <div class="content-container">
    <div class="category">
      <a-radio-group v-model:value="typeSelected" button-style="solid" @change="radioGroupChange">
        <a-radio-button :value="AllType">{{ t('All') }}</a-radio-button>
        <a-radio-button :value="ChildAppTypes.Server">{{ t('Server') }}</a-radio-button>
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
                <a-button type="primary" danger style="margin-right: 5px" @click="del(item.Name)">{{ t('Delete') }} </a-button>
                <a-button type="primary" style="margin-right: 5px" @click="showAddDialog(item)">{{ t('Modify') }} </a-button>
                <a-button v-if="item.CanOpen" @click="openApp(item)">{{ t('Open') }}</a-button>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <a-card size="small">
      <div style="display: flex; justify-content: space-between">
        <a-button type="primary" :icon="h(AppstoreAddOutlined)" @click="showAddDialog(null)">{{ t('Add') }}</a-button>
      </div>
    </a-card>
  </div>

  <a-modal width="600px" :title="isAdd ? t('Add') : t('Modify')" :ok-text="t('Submit')" :cancel-text="t('Cancel')" @ok="save" v-model:open="visible" centered :maskClosable="false">
    <div class="modal-content">
      <a-form ref="formRef" :model="formData" name="basic" autocomplete="off">
        <a-form-item v-if="isAdd" :label="mt('Select', 'ws', 'Template')" name="SelectTemplate">
          <a-select style="width: 220px" v-model:value="selectedTemplate" :options="templateOpts" @change="templateChange" />
        </a-form-item>
        <a-form-item label="Type" name="Type" :rules="[{ required: true }]">
          <a-select style="width: 120px" v-model:value="formData.Type" :options="typeOptions" />
        </a-form-item>
        <a-form-item label="Process Control Mode" name="ctrlServerMode" :rules="[{ required: true }]" v-if="formData.Type == ChildAppTypes.Server">
          <a-select style="width: 180px" v-model:value="formData.ctrlServerMode" :options="processControlModeOpts" />
        </a-form-item>

        <a-form-item label="Name" name="Name" :rules="[{ required: true, message: t('cannotBeEmpty') }]">
          <a-input v-model:value="formData.Name" spellcheck="false" :disabled="!isAdd" :placeholder="formData.Type == ChildAppTypes.PHP ? 'php-x.x.x' : ''" />
        </a-form-item>

        <a-form-item label="Server Name" name="ServerName" v-if="isRealServer(formData.Type)">
          <a-tooltip :title="'On the Home page, replace \'Name\'.' + (!isAdd ? `Restart ${APP_NAME} to take effect` : '')">
            <a-input v-model:value="formData.ServerName" spellcheck="false" placeholder="" />
          </a-tooltip>
        </a-form-item>

        <a-form-item label="Server Status Check Mode" name="checkServerMode" :rules="[{ required: true }]" v-if="formData.Type == ChildAppTypes.Server">
          <a-select style="width: 180px" v-model:value="formData.checkServerMode" :options="serverStatusCheckModeOpts" />
        </a-form-item>

        <a-form-item
          label="Server Port"
          name="ServerPort"
          v-if="isRealServer(formData.Type) && formData.checkServerMode == 1"
          :rules="[{ required: true, type: 'number', min: 1, max: 65535 }]"
        >
          <a-tooltip title="On the Home page, check the server process status by port (e.g. enter 3000 for a Node site).">
            <a-input-number style="width: 120px" v-model:value="formData.ServerPort" min="1" max="65535" />
          </a-tooltip>
        </a-form-item>

        <a-form-item
          label="Control Process Path"
          name="ControlProcessPath"
          v-if="formData.Type == ChildAppTypes.Server && formData.ctrlServerMode == 1"
          :rules="[{ required: true, message: t('cannotBeEmpty') }]"
        >
          <InputOpenFileDialog v-model:value="formData.ControlProcessPath" :toForwardSlash="true" :placeholder="isWindows ? 'bin/pg_ctl.exe' : 'bin/pg_ctl'" />
        </a-form-item>

        <a-form-item label="Server Process Path" name="ServerProcessPath" v-if="isRealServer(formData.Type)" :rules="[{ required: true, message: t('cannotBeEmpty') }]">
          <InputOpenFileDialog v-model:value="formData.ServerProcessPath" :toForwardSlash="true" :placeholder="getServerProcessPathPlaceholder()" />
        </a-form-item>

        <a-form-item
          label="Start Server Args"
          name="StartServerArgs"
          v-if="isRealServer(formData.Type)"
          :rules="[{ required: formData.ctrlServerMode == EnumServerStatusCheckMode.PortStatus, message: t('cannotBeEmpty') }]"
        >
          <a-input v-model:value="formData.StartServerArgs" spellcheck="false" :placeholder="getStartServerArgsPlaceholder()" />
        </a-form-item>
        <a-form-item label="Stop Server Args" name="StopServerArgs" v-if="formData.Type == ChildAppTypes.Server && formData.ctrlServerMode == 1">
          <a-input v-model:value="formData.StopServerArgs" spellcheck="false" />
        </a-form-item>

        <a-form-item
          label="App Path"
          :name="isMacOS ? 'WorkDir' : 'ProcessPath'"
          v-if="formData.Type == ChildAppTypes.Tool"
          :rules="[{ required: true, message: t('cannotBeEmpty') }]"
        >
          <InputOpenFileDialog method="showOpenApp" v-model:value="formData.ProcessPath" :toForwardSlash="true" v-if="isWindows" />
          <InputOpenFileDialog method="showOpenApp" v-model:value="formData.WorkDir" :toForwardSlash="true" v-if="isMacOS" />
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
import { AppstoreAddOutlined } from '@ant-design/icons-vue'
import { isRealServer } from '@/shared/helpers/childApp'
import { ChildAppTypes } from '@/main/helpers/constant'
import { isMacOS, isWindows } from '@/shared/utils/utils2'
import InputOpenFileDialog from '@/renderer/components/Input/InputOpenFileDialog.vue'
import Opener from '@/renderer/utils/Opener'
import CustomChildApp from '@/main/services/childApp/CustomChildApp'
import { message } from 'ant-design-vue'
import { APP_NAME } from '@/shared/helpers/constant'
import { EnumServerStatusCheckMode } from '@/shared/helpers/enum'

const store = useMainStore()
const { customChildAppList } = storeToRefs(store)
const formRef = ref()
const AllType = 'AllType'
const typeSelected = ref(AllType)
const visible = ref(false)
const primaryName = ref('')
let isAdd = ref(true)
const selectedTemplate = ref(null)
const initialData = {
  Type: ChildAppTypes.Server,
  ctrlServerMode: 0,
  checkServerMode: 0,
  Name: '',
  WorkDir: '',
  ServerName: '',
  ServerPort: null,
  ControlProcessPath: '',
  ServerConfPath: '',
  ServerProcessPath: '',
  StartServerArgs: '',
  StopServerArgs: '',
  Desc: ''
}
const formData = reactive({ ...initialData })

const typeOptions = [
  { value: ChildAppTypes.Server, label: t('Server') },
  { value: ChildAppTypes.PHP, label: 'PHP' },
  { value: ChildAppTypes.Tool, label: t('Tool') }
]
const processControlModeOpts = [
  { value: 0, label: 'Server Process' },
  { value: 1, label: 'Control Process' }
]
const enumTemplate = {
  PHP: 0,
  MySQL: 1,
  Node: 2,
  PgSQL: 3
}
const templateOpts = [
  { value: null, label: t('none') },
  { value: enumTemplate.PHP, label: 'PHP' },
  { value: enumTemplate.MySQL, label: 'MySQL' },
  { value: enumTemplate.PgSQL, label: 'PostgreSQL' },
  { value: enumTemplate.Node, label: 'Node Site/Node Server' }
]

const templateChange = (selectedTemplate) => {
  Object.assign(formData, initialData)
  if (selectedTemplate != null) Object.assign(formData, getTemplateValues(selectedTemplate))
}

function getTemplateValues(selectedTemplate) {
  switch (selectedTemplate) {
    case enumTemplate.PHP: {
      const common = {
        Type: ChildAppTypes.PHP,
        Name: 'php-x.x.x'
      }
      if (isWindows) {
        return {
          ...common,
          ServerProcessPath: '???/php-cgi.exe',
          StartServerArgs: '-b 127.0.0.1:92??',
          ServerName: 'php-cgi-x.x.x',
          Desc: "The port after '127.0.0.1' must be > 9200 and unique.",
        }
      } else {
        return {
          ...common,
          ServerProcessPath: '???/sbin/php-fpm',
          StartServerArgs: '-F',
          ServerName: 'php-fpm-x.x.x'
        }
      }
    }

    case enumTemplate.MySQL: {
      const common = {
        Type: ChildAppTypes.Server,
        Name: 'mysql-x.x.x'
      }
      if (isWindows) {
        return {
          ...common,
          ServerProcessPath: '???/bin/mysqld.exe',
          StartServerArgs: '--defaults-file=???/my.ini'
        }
      } else {
        return {
          ...common,
          ServerProcessPath: '???/bin/mysqld',
          StartServerArgs: '--defaults-file=???/my.cnf'
        }
      }
    }

    case enumTemplate.PgSQL: {
      const common = {
        Type: ChildAppTypes.Server,
        ctrlServerMode: 1,
        Name: 'postgreSQL-x.x.x',
        ServerName: '',
        StartServerArgs: 'start -D ???/pgsql/data',
        StopServerArgs: 'stop -D ???/pgsql/data'
      }
      if (isWindows) {
        return {
          ...common,
          ControlProcessPath: '???/bin/pg_ctl.exe',
          ServerProcessPath: '???/bin/postgres.exe'
        }
      } else {
        return {
          ...common,
          ControlProcessPath: '???/bin/pg_ctl',
          ServerProcessPath: '???/bin/postgres'
        }
      }
    }

    case enumTemplate.Node: {
      const common = {
        Type: ChildAppTypes.Server,
        checkServerMode: 1,
        ServerPort: 3000,
        Name: 'node-x.x.x',
        ServerName: 'node-site',
        StartServerArgs: 'node ???/server.js'
      }
      if (isWindows) {
        return {
          ...common,
          ServerProcessPath: '???/nodejs/node.exe'
        }
      } else {
        return {
          ...common,
          ServerProcessPath: '???/usr/local/bin/node'
        }
      }
    }
    default:
      return {}
  }
}

const serverStatusCheckModeOpts = [
  { value: EnumServerStatusCheckMode.ProcessStatus, label: 'Process Status' },
  { value: EnumServerStatusCheckMode.PortStatus, label: 'Port Status' }
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
  isAdd.value = !item
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
  if (!primaryName.value && customChildAppList.value.find((item) => item.Name === values.Name)) {
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
