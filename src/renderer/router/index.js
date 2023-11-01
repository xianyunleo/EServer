import {createRouter,createWebHashHistory} from "vue-router"

const routes = [
    {path:'/', component:()=>import('@/renderer/views/Home.vue'),},
    {path:'/website', component:()=>import('@/renderer/views/Website.vue'),},
    {path:'/tool', component:()=>import('@/renderer/views/Tool.vue'),},
    {path:'/software', component:()=>import('@/renderer/views/Software.vue'),},
    {path:'/settings', component:()=>import('@/renderer/views/Settings.vue'),},
    {path:'/about', component:()=>import('@/renderer/views/About.vue'),},
]
const router =  createRouter({
    history:createWebHashHistory(),
    routes
})

export default router
