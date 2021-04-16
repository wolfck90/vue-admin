import service from '@/utils/request.js'

export function GetList(data) {
  return service.request({
    method: 'post',
    url: '/user/getList/',
    data
  })
}

export function AddUser(data) {
  return service.request({
    method: 'post',
    url: '/user/add/',
    data
  })
}
// 批量删除用户
export function DelUser(data) {
  return service.request({
    method: 'post',
    url: '/user/delete/',
    data
  })
}

// 禁用/启用用户状态
export function ChangeUserStatus(data) {
  return service.request({
    method: 'post',
    url: '/user/actives/',
    data
  })
}

// 编辑用户
export function EditUser(data) {
  return service.request({
    method: 'post',
    url: '/user/edit/',
    data
  })
}

// 获取系统
export function GetSystem(data) {
  return service.request({
    method: 'post',
    url: '/system/',
    data
  })
}

// 获取角色
export function GetRoles(data) {
  return service.request({
    method: 'post',
    url: '/role/',
    data
  })
}

// 获取按钮
export function GetBtnPerm(data) {
  return service.request({
    method: 'post',
    url: '/permButton/',
    data
  })
}
