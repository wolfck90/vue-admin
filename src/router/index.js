import Vue from 'vue'
import VueRouter from 'vue-router'

//  将布局页面注册抽出来，以便复用
import LayOut from '../views/layout/index'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: 'login',
    hidden: true,
    meta: {
      name: '主页'
    }
  },
  {
    path: '/login',
    name: 'Login',
    hidden: true,
    meta: {
      name: '登录'
    },
    component: () => import('../views/login/index')
  },
  // 后台控制台
  {
    path: '/console',
    name: 'Console',
    redirect: '/index',
    meta: {
      name: '控制台',
      icon: 'console'
    },
    component: LayOut,

    children: [
      {
        path: '/index',
        name: 'Index',
        meta: {
          name: '首页'
        },
        component: () => import('../views/console/index')
      }
    ]
  },
  // 信息管理
  {
    path: '/info',
    name: 'Info',
    meta: {
      name: '信息管理',
      icon: 'info'
    },
    component: LayOut,

    children: [
      {
        path: '/infoIndex',
        name: 'InfoIndex',
        meta: {
          name: '信息列表'
        },
        component: () => import('../views/info/index')
      },
      {
        path: '/infoCategory',
        name: 'InfoCategory',
        meta: {
          name: '信息分类'
        },
        component: () => import('../views/info/category')
      },
      {
        path: '/infoDetail',
        name: 'InfoDetail',
        hidden: true,
        meta: {
          name: '信息详情'
        },
        component: () => import('../views/info/detail')
      }
    ]
  },
  // 用户界面
  {
    path: '/user',
    name: 'User',
    meta: {
      name: '用户管理',
      icon: 'user'
    },
    component: LayOut,
    children: [
      {
        path: '/userCategory',
        name: 'UserCategory',
        meta: {
          name: '用户列表'
        },
        component: () => import('../views/user/index')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
