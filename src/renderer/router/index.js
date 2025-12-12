import {createRouter,createWebHashHistory} from "vue-router"

const routes = [
    { path: '/', component: () => import('@/renderer/views/Home/Home.vue') },
    { path: '/website', component: () => import('@/renderer/views/Website/Website.vue') },
    { path: '/tool', component: () => import('@/renderer/views/Tool/Tool.vue') },
    { path: '/appStore', component: () => import('@/renderer/views/ChildApp/ChildApp.vue') },
    { path: '/settings', component: () => import('@/renderer/views/Settings/Settings.vue') },
    { path: '/about', component: () => import('@/renderer/views/About/About.vue') },
    { path: '/customApp', component: () => import('@/renderer/views/CustomChildApp/CustomChildApp.vue') },
    { path: '/donate', component: () => import('@/renderer/views/Donate/Donate.vue') }
]
const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
