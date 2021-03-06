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
          path: '/upload',
          component: () => import('@/views/Home/Upload/Upload.vue')
        },
        // 视频列表页
        {
          name: 'videos',
          path: '/videos',
          component: () => import('@/views/Home/Video/Video.vue')
        },
        // 视频搜索页
        {
          name: 'videosearch',
          path: '/search/:content',
          component: () => import('@/views/Home/VideoSearch/VideoSearch.vue'),
          props: true
        },
        // 视频播放页
        {
          path: '/detail/:id',
          component: () => import('@/views/Home/VideoDetail/VideoDetail.vue'),
          props: true
        },
        // 个人中心页
        {
          name: 'personal',
          path: '/personal',
          component: () => import('@/views/Home/Personal/Personal.vue')
        },
        // 消息界面
        {
          path: '/:userid/message',
          redirect: '/:userid/message/sysinfo',
          component: () => import('@/views/Home/Message/Message.vue'),
          children: [
            {
              name: 'sysinfo',
              path: '/:userid/message/sysinfo',
              component: () => import('@/views/Home/Message/SysInfo/SysInfo.vue')
            },
            {
              name: 'reply',
              path: '/:userid/message/reply',
              component: () => import('@/views/Home/Message/Reply/Reply.vue')
            }
          ]
        },
        // 直播界面
        {
          name: 'live',
          path: '/live/:id',
          component: () => import('@/views/Home/Live/Live.vue'),
          props: true
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
  const pathArr = ['/upload']
  const nameArr = ['personal', 'sysinfo', 'reply']
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

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

export default router
