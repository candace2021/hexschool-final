import { createRouter, createWebHashHistory } from 'vue-router'
import cookie from '@/utils/cookie'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
    },
  ],
})

router.beforeEach((to, from, next) => {
  const isLogin = cookie.get('token') ? true : false
  if (to.path === '/login' || to.path === '/register') {
    isLogin ? next('/') : next()
  } else {
    isLogin ? next() : next('/login')
  }
})

export default router
