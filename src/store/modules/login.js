
import { Login } from '../../api/login'

const state = {
  isCollapse: JSON.parse(sessionStorage.getItem('isCollapse')) || false
  // 这里用cookie会出现问题，json.parse取不到值
  // isCollapse: JSON.parse(cookie.get('isCollapse')) || false
}

const getters = {}

const mutations = {
  // 处理同步数据
  set_collapse(state) {
    console.log('login')
    state.isCollapse = !state.isCollapse
    // 为了避免刷新时，左侧菜单会弹出，将数据保存到sessionStorage里面,session 最大存储5m，第二个值必须为字符串
    sessionStorage.setItem('isCollapse', JSON.stringify(state.isCollapse))
    // 用cookie保存数据
    // cookie.set('isCollapse', JSON.stringify(state.isCollapse))
  }
}

const actions = {
  // 处理异步数据，通过$store.commit()调用
  // 这里面一般有两个参数，第一个参数可以自定义名字，相当于$store,可以取到state,commit,dispath,getters,rootGetters,rootState，第二个参数就是传过来的数据
  login(content, requestData) {
    return new Promise((resolve, reject) => {
      // 接口
      Login(requestData)
        .then(response => {
          resolve(response)
        })
        .catch(error => {
          reject(error)
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
