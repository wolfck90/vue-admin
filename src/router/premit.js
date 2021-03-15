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
      store.commit('set_token', '')
      store.commit('set_username', '')
      next()
    }
    next()
  } else {
    // 判断当前要进入的页面是否在白名单中，如果在，就放行，如果不在就跳转到login，请求用户登录
    if (whiteRouter.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
    }
  }
})
