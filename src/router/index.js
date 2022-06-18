import {createRouter,createWebHashHistory} from "vue-router"

const routes = [
    {path:'/', component:()=>import('@/views/HomePage'),},
    {path:'/website', component:()=>import('@/views/WebSite'),},
    {path:'/tool', component:()=>import('@/views/WebSite'),},
    {path:'/software', component:()=>import('@/views/WebSite'),},
    {path:'/setting', component:()=>import('@/views/WebSite'),},
    {path:'/about', component:()=>import('@/views/WebSite'),},
]
const router =  createRouter({
    history:createWebHashHistory(),
    routes
})

export default router