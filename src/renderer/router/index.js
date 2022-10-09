import {createRouter,createWebHashHistory} from "vue-router"

const routes = [
    {path:'/', component:()=>import('@/renderer/views/Home'),},
    {path:'/website', component:()=>import('@/renderer/views/Website'),},
    {path:'/tool', component:()=>import('@/renderer/views/Tool'),},
    {path:'/software', component:()=>import('@/renderer/views/Software'),},
    {path:'/setting', component:()=>import('@/renderer/views/Setting'),},
    {path:'/about', component:()=>import('@/renderer/views/About'),},
]
const router =  createRouter({
    history:createWebHashHistory(),
    routes
})

export default router
