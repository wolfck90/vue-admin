import axios from 'axios'
import { Message } from 'element-ui'

const BASEURL = process.env.NODE_ENV === 'production' ? '' : '/devApi'
// 将axios赋值给service，就是替换个名字
const service = axios.create({
  baseURL: BASEURL,
  timeout: 15000 // 网络超时时间，这个可以设置的长一点
})

// 请求拦截器
service.interceptors.request.use(
  function(config) {
    // 在发送请求之前做些什么
    // 在请求头中添加一些数据传给后台，token,userId,sui
    config.headers.token = '1111'
    config.headers.userId = '2222'
    config.headers.sui = '3333'

    return config
  },
  function(error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  function(response) {
    // 对响应数据做点什么
    const responseData = response.data
    // 业务需求
    // 如果返回的resCode不是0，就弹出消息框提示用户邮箱不正确，并把对应的数据传到前台，相应的login.js中也要记得返回数据，不然接收不到
    if (responseData.resCode !== 0) {
      Message.error(responseData.message)
      return Promise.reject(responseData)
    } else {
      return response
    }
  },
  function(error) {
    // 对响应错误做点什么
    return Promise.reject(error)
  }
)

export default service
