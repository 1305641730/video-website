import Vue from 'vue'
import VueRouter from 'vue-router'

import { validateToken } from '@/api/user.js'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    // 主页
    {
      path: '/',
      redirect: '/videos',
      component: () => import('@/views/Home'),
      children: [
        // 视频上传页
        {
          path: 'upload',
          component: () => import('@/views/Home/Upload/Upload.vue')
        },
        // 视频列表页
        {
          path: 'videos',
          component: () => import('@/views/Home/Video/Video.vue')
        },
        // 视频播放页
        {
          path: 'detail/:id',
          component: () => import('@/views/Home/VideoDetail/VideoDetail.vue'),
          props: true
        },
        // 个人中心页
        {
          name: 'personal',
          path: 'personal',
          component: () => import('@/views/Home/Personal/Personal.vue')
        }
      ]
    },
    // 登录页
    {
      path: '/login',
      component: () => import('@/views/Login/Login.vue')
    },
    // 注册页
    {
      path: '/register',
      component: () => import('@/views/Register/Register.vue')
    }
  ]
})

router.beforeEach(async(to, from, next) => {
  const pathArr = ['/videos', '/upload', '/']
  const nameArr = ['personal']
  if (pathArr.indexOf(to.path) !== -1 || nameArr.indexOf(to.name) !== -1) {
    const token = localStorage.getItem('token')
    if (token) {
      const { data: res } = await validateToken(token)
      if (res.data && res.flag) {
        next()
      } else {
        next('/login')
      }
    } else {
      next('/login')
    }
  } else {
    next()
  }
})

export default router
