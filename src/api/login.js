import service from '@/utils/request.js'

// 获取验证码
export function GetSms(data) {
  return service.request({
    url: '/getSms/',
    method: 'post',
    data
    //   这里data只写一个是es6语法，两个同名的话可以只写一个
  })
}

// 登录
export function Login(data) {
  return service.request({
    url: '/login/',
    method: 'post',
    data
  })
}

// 退出登录
export function Logout(data = {}) {
  return service.request({
    url: '/logout/',
    method: 'post',
    data
  })
}

// 注册

export function Register(data) {
  return service.request({
    url: '/register/',
    method: 'post',
    data
  })
}

// 获取用户角色
export function GetUserRole(data = {}) {
  return service.request({
    url: '/userRole/',
    method: 'post',
    data
  })
}
