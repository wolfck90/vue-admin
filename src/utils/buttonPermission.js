import store from '../store/index'

export function buttonPermission(permission) {
  const button = store.getters['app/buttonPermission']
  const role = store.getters['app/role']
  // 如果是管理员，那就直接返回true
  if (role.includes('admin')) {
    return true
  } else {
    return button.indexOf(permission) !== -1
  }
}
