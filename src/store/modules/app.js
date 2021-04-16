import { Login, Logout } from '../../api/login'
import { setToken, removeToken, setUserName, getUserName, removeUserName } from '@/utils/app'

const state = {
  isCollapse: false || JSON.parse(sessionStorage.getItem('isCollapse')),
  token: '',
  username: '' || getUserName(),
  role: [],
  buttonPermission: []
}

const getters = {
  isCollapse: state => state.isCollapse,
  // username: state => state.username
  role: state => state.role,
  buttonPermission: state => state.buttonPermission
}

const mutations = {
  // 处理同步数据
  set_collapse(state) {
    state.isCollapse = !state.isCollapse
    // 为了避免刷新时，左侧菜单会弹出，将数据保存到sessionStorage里面,session 最大存储5m，第二个值必须为字符串
    sessionStorage.setItem('isCollapse', JSON.stringify(state.isCollapse))
    // 用cookie保存数据
    // cookie.set('isCollapse', JSON.stringify(state.isCollapse))
  },
  // 保存token
  set_token(state, value) {
    // 将token保存在vuex中
    state.token = value
  },
  // 保存username
  set_username(state, value) {
    state.username = value
  },
  // 存储role
  Set_Role(state, value) {
    state.role = value
  },
  // 存储button权限
  Set_Button(state, value) {
    state.buttonPermission = value
  }
}

const actions = {
  // 处理异步数据，通过$store.commit()调用
  // 这里面一般有两个参数，第一个参数可以自定义名字，相当于$store,可以取到state,commit,dispath,getters,rootGetters,rootState，第二个参数就是传过来的数据
  login({ commit }, requestData) {
    return new Promise((resolve, reject) => {
      // 接口
      Login(requestData)
        .then(response => {
          const data = response.data.data
          // 解构的方式
          commit('set_token', data.token)
          commit('set_username', data.username)
          // 将token和username保存在cookie中，调用相关方法
          setToken(data.token)
          setUserName(data.username)
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  // 退出
  logout({ commit }) {
    return new Promise(resolve => {
      Logout().then(response => {
        const data = response.data
        // 清除cookie的数据
        removeToken()
        removeUserName()
        // 清除vuex中的数据
        commit('set_token', '')
        commit('set_username', '')
        commit('Set_Role', [])
        resolve(data)
      })
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
