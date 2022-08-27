import {createRouter,createWebHashHistory} from "vue-router"

const routes = [
    {path:'/', component:()=>import('@/renderer/views/HomePage'),},
    {path:'/website', component:()=>import('@/renderer/views/WebsitePage'),},
    {path:'/tool', component:()=>import('@/renderer/views/ToolPage'),},
    {path:'/software', component:()=>import('@/renderer/views/SoftwarePage'),},
    {path:'/setting', component:()=>import('@/renderer/views/SettingPage'),},
    {path:'/about', component:()=>import('@/renderer/views/AboutPage'),},
]
const router =  createRouter({
    history:createWebHashHistory(),
    routes
})

export default router