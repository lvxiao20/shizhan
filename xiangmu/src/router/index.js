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
      component: () => import('../views/Home.vue'),
  
    },
  ]
})
// 路由守卫
router.beforeEach((to, from, next) => {
  if (to.path == '/') return next()
  console.log(1);
  const tokenStr = window.sessionStorage.getItem('token')
  console.log(tokenStr);

  if (!tokenStr) return next('/')
  next()
  console.log(2);
})

export default router
