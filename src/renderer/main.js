import { createApp } from 'vue'
import App from './App.vue'

import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import './assets/css/index.scss'
import router from './router'
import {createPinia} from 'pinia'

const app = createApp(App)
const pinia =  createPinia()
app.use(router)
app.use(pinia)
app.use(Antd)
app.mount('#app')

