// 时间戳格式化

// export function timestampToTime(timestamp) {
//   const now = new Date(timestamp * 1000)
//   const year = now.getFullYear()
//   const month = now.getMonth() + 1
//   const date = now.getDate()
//   const hour = now.getHours()
//   const minute = now.getMinutes()
//   const second = now.getSeconds()
//   return year + '-' + month + '-' + date + '   ' + hour + ':' + minute + ':' + second
// }
export function timestampToTime(value) {
  const date = new Date(value * 1000)
  const y = date.getFullYear()
  let m = date.getMonth() + 1
  let d = date.getDate()
  let h = date.getHours()
  let m1 = date.getMinutes()
  let s = date.getSeconds()
  m = m < 10 ? '0' + m : m
  d = d < 10 ? '0' + d : d
  h = h < 10 ? '0' + h : h
  m1 = m1 < 10 ? '0' + m1 : m1
  s = s < 10 ? '0' + s : s
  return y + '-' + m + '-' + d + ' ' + h + ':' + m1 + ':' + s
}

// export function timestampToTime(time_stamp) {
//   // time_stamp = 1603352168;
//   const date = new Date(parseInt(time_stamp) * 1000).toLocaleString('zh', { hour12: false })
//   return date
//   // 得到的日期形式为 ： 2020/10/22 15:36:08
// }
