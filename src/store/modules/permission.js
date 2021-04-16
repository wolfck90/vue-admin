import { GetUserRole } from '@/api/login'
// 引入路由
import { defaultRouteMap, asyncRouteMap } from '@/router'

function hasPremission(roles, router) {
  // console.log(roles)
  // sale,technician,manager
  // console.log(router.meta.role)
  // sale
  if (router.meta && router.meta.role) {
    return roles.some(item => router.meta.role.indexOf(item) >= 0)
  }
}
const state = {
  // 整体路由默认等于默认路由
  allRouters: defaultRouteMap,
  // 动态路由
  addRouters: []
}

const getters = {
  allRouters: state => state.allRouters,
  addRouters: state => state.addRouters
}

const mutations = {
  // 存储路由
  Set_Router(state, router) {
    state.addRouters = router
    state.allRouters = defaultRouteMap.concat(router)
  }
}

const actions = {
  getRole({ commit }, requestData) {
    return new Promise((resolve, reject) => {
      GetUserRole().then(response => {
        const data = response.data.data
        // commit('Set_Role', data.role)
        resolve(data)
      })
    })
  },
  // 创建动态路由
  creatRouter({ commit }, data) {
    return new Promise((resolve, reject) => {
      // 存储角色
      const role = data
      let addRouters = []
      // 超级管理员
      if (role.includes('admin')) {
        addRouters = asyncRouteMap
      } else {
        // 就是普通管理员，遍历动态路由, 然后看role里面时候包含动态路由meta里面的时候有对应的角色
        // 调用函数
        addRouters = asyncRouteMap.filter(item => {
          if (hasPremission(role, item)) {
            // 判断是否有children
            if (item.children && item.children.length > 0) {
              item.children = item.children.filter(child => {
                if (hasPremission(role, child)) {
                  return child
                }
              })
            }
            return item
          }
          return item
        })
        // 在最后把404页面加入到路由最后面,404页面在动态路由最后一项
        addRouters.push(asyncRouteMap[asyncRouteMap.length - 1])
      }
      // 更新路由
      commit('Set_Router', addRouters)
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
