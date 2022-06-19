import {createRouter,createWebHashHistory} from "vue-router"

const routes = [
    {path:'/', component:()=>import('@/views/HomePage'),},
    {path:'/website', component:()=>import('@/views/WebsitePage'),},
    {path:'/tool', component:()=>import('@/views/ToolPage'),},
    {path:'/software', component:()=>import('@/views/SoftwarePage'),},
    {path:'/setting', component:()=>import('@/views/SettingPage'),},
    {path:'/about', component:()=>import('@/views/AboutPage'),},
]
const router =  createRouter({
    history:createWebHashHistory(),
    routes
})

export default router