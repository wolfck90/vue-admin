const state = {
  // 不刷新页面的情况下，值一直存在与vuex中，
  // 刷新页面后，取不到vuex中的值，从session中获取，赋值给变量
  id: '' || sessionStorage.getItem('infoId'),
  title: '' || sessionStorage.getItem('infoTitle')
}

const getters = {
  infoId: state => state.id,
  InfoTitle: state => state.title
}

const mutations = {
  set_id(state, value) {
    state.id = value
    // 将id存到session里面
    sessionStorage.setItem('infoId', value)
  },
  set_title(state, value) {
    state.title = value
    sessionStorage.setItem('infoTitle', value)
  }
}

const actions = {}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
