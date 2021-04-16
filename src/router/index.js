import Vue from 'vue'
import VueRouter from 'vue-router'

//  将布局页面注册抽出来，以便复用
import LayOut from '../views/layout/index'

// 重写push和replace方法，可以解决Redirected when going from "/login" to "/index" via a navigation guard.报错，或者降低vue-router版本到3.0.7
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(VueRouter)

// 分为默认路由和动态路由

export const defaultRouteMap = [
  {
    path: '/',
    redirect: '/login',
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
  // 404页面
  {
    path: '/page404',
    hidden: true,
    meta: {
      name: '404',
      icon: '404'
    },
    component: LayOut,
    children: [
      {
        path: '/404',
        name: '404',
        component: () => import('../views/404')
      }
    ]
  }
]

// 动态路由

// 角色： sale,technician,manager
export const asyncRouteMap = [
  // 信息管理
  {
    path: '/info',
    name: 'Info',
    meta: {
      keepAlive: true,
      role: ['sale', 'manager'],
      system: 'infoSystem',
      name: '信息管理',
      icon: 'info'
    },
    component: LayOut,

    children: [
      {
        path: '/infoIndex',
        name: 'InfoIndex',
        meta: {
          keepAlive: true,
          role: ['sale', 'manager'],
          name: '信息列表'
        },
        component: () => import('../views/info/index')
      },
      {
        path: '/infoCategory',
        name: 'InfoCategory',
        meta: {
          keepAlive: true,
          role: ['sale', 'manager'],
          name: '信息分类'
        },
        component: () => import('../views/info/category')
      },
      {
        path: '/infoDetail',
        name: 'InfoDetail',
        hidden: true,
        meta: {
          keepAlive: true,
          role: ['sale', 'manager'],
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
      role: ['technician', 'manager'],
      system: 'userSystem',
      name: '用户管理',
      icon: 'user'
    },
    component: LayOut,
    children: [
      {
        path: '/userCategory',
        name: 'UserCategory',
        meta: {
          role: ['technician', 'manager'],
          name: '用户列表'
        },
        component: () => import('../views/user/index')
      }
    ]
  },
  // 当所有路由匹配不到之后就跳转到404页面,放到动态路由里面，放在路由最后面
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

const router = new VueRouter({
  routes: defaultRouteMap
})
// router.$addRoutes = params => {
//   router.matcher = new VueRouter({
//     mode: 'hash',
//     routes: [...defaultRouteMap]
//   }).matcher
//   router.addRoutes(params)
// }
export default router
