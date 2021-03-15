import { GetCategory } from '@/api/news'

const actions = {
  // 处理异步数据，通过$store.commit()调用
  // 这里面一般有两个参数，第一个参数可以自定义名字，相当于$store,可以取到state,commit,dispath,getters,rootGetters,rootState，第二个参数就是传过来的数据
  getCategory(content, requestData) {
    return new Promise((resolve, reject) => {
      // 接口
      GetCategory({})
        .then(response => {
          resolve(response.data.data.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}

export default {
  namespaced: true,
  actions
}
