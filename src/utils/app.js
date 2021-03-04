import cookie from 'cookie_js'

// 通过cookie获取token
const adminToken = 'adminToken'

const UserName = 'username'

// 获取token
export function getToken() {
  return cookie.get(adminToken)
}

// 设置存储token
export function setToken(value) {
  return cookie.set(adminToken, value)
}

// 删除token
export function removeToken() {
  return cookie.remove(adminToken)
}

// 设置，存储用户名username
export function setUserName(value) {
  return cookie.set(UserName, value)
}

// 获取用户名username
export function getUserName() {
  return cookie.get(UserName)
}

// 删除用户名
export function removeUserName() {
  return cookie.remove(UserName)
}
