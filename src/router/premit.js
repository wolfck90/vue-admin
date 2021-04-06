import router from './index'
import store from '../store/index'
import { getToken, removeToken, removeUserName } from '@/utils/app'

// 定义路由白名单,使用indexOf判断是否存在对应元素，如果不存在就返回-1
const whiteRouter = ['/login']

router.beforeEach((to, from, next) => {
  if (getToken()) {
    // 路由动态添加，分配菜单,每个角色分配不同的权限
    // 如果用户退出或者手动进入了login页面，要清除token
    if (to.path === '/login') {
      removeToken()
      removeUserName()
      store.commit('app/set_token', '')
      store.commit('app/set_username', '')
      next()
    } else {
      /*
        获取用户角色，动态分配路由权限
        1.什么时候处理动态路由
        2.以什么条件处理 === 以用户的角色来判断权限
      */
      // 判断state中是否存在role，如果不存在就调接口获取role,如果存在，则直接放行
      if (store.getters['app/role'].length === 0) {
        // 调接口
        store.dispatch('permission/getRole').then(res => {
          console.log(res)
          const role = res.role
          store.commit('app/Set_Role', role)
          // const button = res.button
          store.dispatch('permission/creatRouter', role).then(response => {
            const addRouters = store.getters['permission/addRouters']
            const allRouters = store.getters['permission/allRouters']
            // 更新路由
            router.options.routes = allRouters
            // 添加动态路由
            router.addRoutes(addRouters)
            // router.matcher = addRouters.matcher
            next({ ...to, replace: true })
          })
        })
      } else {
        next()
      }
    }
  } else {
    // 判断当前要进入的页面是否在白名单中，如果在，就放行，如果不在就跳转到login，请求用户登录
    if (whiteRouter.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
    }
  }
})
