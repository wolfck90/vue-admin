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

// 注册

export function Register(data) {
  return service.request({
    url: '/register/',
    method: 'post',
    data
  })
}