import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const router = new VueRouter({
  routes:[
    {
      path: '/',
      component: () => import('../components/login.vue')
    },
    {
      path: '/home',
      redirect: '/home/zhuye',
      component: () => import('../views/Home.vue'),
      children:[
        {
          path:'zhuye',
          component:()=>import('../components/zhuye.vue')
        },
        {
          path:'users',
          component:()=>import('../components/user/users.vue')
        },
        {
          path:'roles',
          component:()=>import('../components/user/roles.vue')
        },
        {
          path:'rights',
          component:()=>import('../components/user/rights.vue')
        },
        {
          path:'goods',
          component:()=>import('../components/user/goods.vue')
        },
        {
          path:'reports',
          component:()=>import('../components/user/reports.vue')
        },
        {
          path:'orders',
          component:()=>import('../components/user/orders.vue')
        },
        {
          path:'categories',
          component:()=>import('../components/user/categories.vue')
        },
        {
          path:'params',
          component:()=>import('../components/user/params.vue')
        },
      ]
  
    },
  ]
})
// 路由守卫
router.beforeEach((to, from, next) => {
  if (to.path == '/') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  console.log(tokenStr);

  if (!tokenStr) return next('/')
  next()
})

export default router
