// 过滤特殊符号

export function stripscript(str) {
  const pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;—|{ }【】‘；：”“'。，、？]")
  let rs = ''
  for (var i = 0; i < str.length; i++) {
    rs = rs + str.substr(i, 1).replace(pattern, '')
  }
  return rs
}
// 验证用户名
export function validateUserNames(value) {
  const reg = /^[a-zA-Z0-9_-]{4,16}$/
  if (!reg.test(value)) {
    return true
  } else {
    return false
  }
}

// 验证邮箱
export function validateEmails(value) {
  const reg = /^([a-zA-Z]|[0-9])(\w)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
  //   return !reg.test(value) ? true : false
  if (!reg.test(value)) {
    return true
  } else {
    return false
  }
}

// 验证密码
export function validatePass(value) {
  const reg = /^(?!\D+$)(?![^a-zA-Z]+$)\S{6,20}$/
  if (!reg.test(value)) {
    return true
  } else {
    return false
  }
}
// 验证真实姓名
export function validateTrueNames(value) {
  const reg = /^[\u4E00-\u9FA5]{2,4}$/
  if (!reg.test(value)) {
    return true
  } else {
    return false
  }
}

// 校验验证码

export function validateCode(value) {
  const reg = /^[a-z0-9]{6}$/
  if (!reg.test(value)) {
    return true
  } else {
    return false
  }
}

// 验证手机号
export function validatePhones(value) {
  const reg = /(^1[3|4|5|7|8|9]\d{9}$)|(^09\d{8}$)/
  if (!reg.test(value)) {
    return true
  } else {
    return false
  }
}
