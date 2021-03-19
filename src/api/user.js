import service from '@/utils/request.js'

export function GetList(data) {
  return service.request({
    method: 'post',
    url: '/user/getList/',
    data
  })
}
