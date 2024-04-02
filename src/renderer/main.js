import { createApp } from 'vue'
import App from './App.vue'
import 'ant-design-vue/dist/reset.css'
import './assets/css/index.less'
import '@vscode/codicons/dist/codicon.css'
import router from './router'
import { createPinia } from 'pinia'
import I18n from '@/renderer/i18n/I18n'
import { extendPrototype } from '@/shared/utils/utils'

const app = createApp(App)
const pinia = createPinia()

app.use(router)
app.use(pinia)
app.use(I18n.getInstance())
app.mount('#app')
extendPrototype()
